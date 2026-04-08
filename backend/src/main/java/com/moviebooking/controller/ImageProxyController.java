package com.moviebooking.controller;

import java.time.Duration;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/image-proxy")
public class ImageProxyController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/**")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        try {
            ResponseEntity<byte[]> response = restTemplate.getForEntity(url, byte[].class);
            HttpHeaders headers = new HttpHeaders();
            headers.setCacheControl(CacheControl.maxAge(Duration.ofDays(7)));
            if (response.getHeaders().getContentType() != null) {
                headers.setContentType(response.getHeaders().getContentType());
            } else {
                headers.setContentType(MediaType.IMAGE_JPEG);
            }
            return new ResponseEntity<>(response.getBody(), headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
