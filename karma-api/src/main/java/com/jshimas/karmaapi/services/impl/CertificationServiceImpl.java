package com.jshimas.karmaapi.services.impl;

import com.jshimas.karmaapi.entities.Participation;
import com.jshimas.karmaapi.services.CertificationService;
import com.jshimas.karmaapi.services.StorageService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType0Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.URL;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class CertificationServiceImpl implements CertificationService {
    private final StorageService storageService;

    @Override
    public String generateCertificate(Participation participation) {
        String certificateFilePath = "certificate_" + participation.getId() + ".pdf";

        if (storageService.exists(certificateFilePath)) {
            return storageService.getFileUrl(certificateFilePath);
        }

        try (PDDocument document = Loader.loadPDF(new File("src/main/resources/static/certification_template.pdf"))) {
            PDPage page = document.getPage(0);
            PDPageContentStream contentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);

            // Fonts and font sizes
            PDFont font = PDType0Font.load(document, new File("C:/Windows/Fonts/ariali.ttf"));
//            PDFont nameFont = new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN);
//            PDFont descriptionFont = new PDType1Font(Standard14Fonts.FontName.TIMES_ROMAN);
            int nameFontSize = 24;
            int descriptionFontSize = 12;

            // Text content
            String hours = participation.getKarmaPoints() / 60 != 0 ? participation.getKarmaPoints() / 60 + " hours " : "";
            String minutes = participation.getKarmaPoints() % 60 != 0 ? participation.getKarmaPoints() % 60 + " minutes " : "";
            String name = participation.getVolunteer().getFirstName() + " " + participation.getVolunteer().getLastName();
            String participatingIn = "For volunteering " + hours + minutes  + " in the " + participation.getActivity().getName();
            ZonedDateTime zonedDateTime = participation.getActivity().getStartDate().atZone(ZoneId.of("Europe/Vilnius"));
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);
            String heldBy = "Held by " + participation.getActivity().getOrganization().getName() + " on " + zonedDateTime.format(formatter);

            // Text widths
            float nameWidth = font.getStringWidth(name) / 1000 * nameFontSize;
            float participatingInWidth = font.getStringWidth(participatingIn) / 1000 * descriptionFontSize;
            float heldByWidth = font.getStringWidth(heldBy) / 1000 * descriptionFontSize;

            // Text positions
            float startX = (page.getMediaBox().getWidth() - nameWidth) / 2;
            float startY = 205;
            float lineSpacing = 20;

            // Write name
            writeText(contentStream, name, font, nameFontSize, startX, startY);
            startY -= lineSpacing;

            // Write participatingIn
            writeText(contentStream, participatingIn, font, descriptionFontSize, (page.getMediaBox().getWidth() - participatingInWidth) / 2, startY);
            startY -= lineSpacing;

            // Write heldBy
            writeText(contentStream, heldBy, font, descriptionFontSize, (page.getMediaBox().getWidth() - heldByWidth) / 2, startY);

            BufferedImage image = loadImageFromUrl(participation.getActivity().getOrganization().getImageUrl());
            if (image != null) {
                addImage(document, page, contentStream, image);
            }

            contentStream.close();

            // Convert document to byte array
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            document.save(byteArrayOutputStream);
            byte[] certificateBytes = byteArrayOutputStream.toByteArray();

            // Save certificate PDF to storage service
            return storageService.savePDF(certificateBytes, certificateFilePath);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private void writeText(PDPageContentStream contentStream, String text, PDFont font, int fontSize, float x, float y) throws IOException {
        contentStream.beginText();
        contentStream.setFont(font, fontSize);
        contentStream.newLineAtOffset(x, y);
        contentStream.showText(text);
        contentStream.endText();
    }

    private BufferedImage loadImageFromUrl(String imageUrl) {
        try (InputStream inputStream = new URL(imageUrl).openStream()) {
            return ImageIO.read(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    private void addImage(PDDocument document, PDPage page, PDPageContentStream contentStream, BufferedImage image) throws IOException {
        int desiredHeight = 100;
        float aspectRatio = (float) image.getWidth() / image.getHeight();
        int newWidth = Math.round(desiredHeight * aspectRatio);
        float startX = (float) ((page.getMediaBox().getWidth() - newWidth * 0.9) / 2);
        float startY = 40;
        Image resizedImage = image.getScaledInstance(newWidth, desiredHeight, Image.SCALE_SMOOTH);
        BufferedImage resizedBufferedImage = new BufferedImage(newWidth, desiredHeight, BufferedImage.TYPE_INT_RGB);
        resizedBufferedImage.getGraphics().drawImage(resizedImage, 0, 0, null);
        PDImageXObject pdImage = PDImageXObject.createFromByteArray(document, imageToByteArray(resizedBufferedImage), "image");
        contentStream.drawImage(pdImage, startX, startY);
    }

    private byte[] imageToByteArray(BufferedImage image) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        return baos.toByteArray();
    }
}
