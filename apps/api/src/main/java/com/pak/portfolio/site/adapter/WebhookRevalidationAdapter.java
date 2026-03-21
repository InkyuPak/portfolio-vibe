package com.pak.portfolio.site.adapter;

import com.pak.portfolio.common.config.PortfolioProperties;
import com.pak.portfolio.site.port.RevalidationPort;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class WebhookRevalidationAdapter implements RevalidationPort {

    private static final Logger log = LoggerFactory.getLogger(WebhookRevalidationAdapter.class);

    private final RestTemplate restTemplate;
    private final PortfolioProperties properties;

    public WebhookRevalidationAdapter(RestTemplateBuilder builder, PortfolioProperties properties) {
        this.restTemplate = builder.build();
        this.properties = properties;
    }

    @Override
    public void revalidateAll() {
        String url = properties.getWebhook().getRevalidateUrl();
        if (url == null || url.isBlank()) {
            return;
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            restTemplate.postForEntity(
                    url,
                    new HttpEntity<>(Map.of("secret", properties.getWebhook().getRevalidateSecret()), headers),
                    Void.class);
        } catch (Exception exception) {
            log.warn("Failed to trigger revalidation: {}", exception.getMessage());
        }
    }
}
