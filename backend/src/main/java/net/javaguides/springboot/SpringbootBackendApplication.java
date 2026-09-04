package net.javaguides.springboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SpringbootBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootBackendApplication.class, args);
		System.out.println("======================================");
		System.out.println("Spring Boot backend started successfully");
		System.out.println("Open: http://localhost:8080");
		System.out.println("======================================");
	}

}
