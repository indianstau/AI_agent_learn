// package net.javaguides.springboot;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.config.annotation.CorsRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// public class WebConfig {

//     @Bean
//     public WebMvcConfigurer corsConfigurer() {
//         return new WebMvcConfigurer() {
//             @Override
//             public void addCorsMappings(CorsRegistry registry) {
//                 registry.addMapping("/**")
//                         .allowedOrigins(
//                                 "http://localhost:3000",
//                                 "https://frontendno1.up.railway.app"
//                         )
//                         .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
//                         .allowedHeaders("*")
//                         .allowCredentials(true)
//                         .maxAge(3600);
//             }
//         };
//     }
// }
package net.javaguides.springboot;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // 1. 允許攜帶憑證（Cookie/Token 等）
        config.setAllowCredentials(true);
        
        // 2. 設置精確的前端 Origin（結尾絕對不可有斜線 /）
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("https://frontendno1.up.railway.app");
        
        // 3. 允許所有 Header 標頭
        config.addAllowedHeader("*");
        
        // 4. 允許所有 HTTP 請求方法
        config.addAllowedMethod("GET");
        config.addAllowedMethod("POST");
        config.addAllowedMethod("PUT");
        config.addAllowedMethod("DELETE");
        config.addAllowedMethod("OPTIONS");
        
        // 5. 快取預檢請求時間
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
