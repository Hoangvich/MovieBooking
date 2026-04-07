# MovieBooking Backend - Spring Boot 3.x

## Tech Stack
- Java 17, Spring Boot 3.2.5
- MySQL 8.0, Redis 7
- Spring Security + JWT (jjwt 0.12.5)
- Spring Data JPA, MapStruct, Lombok
- Swagger/OpenAPI 3 (SpringDoc)
- VNPay Payment Integration
- Docker, Docker Compose

## Chạy nhanh với Docker

```bash
docker-compose up -d
```

API sẽ chạy tại `http://localhost:8080`

## Chạy thủ công

### Yêu cầu
- Java 17+
- MySQL 8.0 chạy tại localhost:3306
- Redis chạy tại localhost:6379

### Cấu hình
Sửa file `src/main/resources/application.yml` nếu cần thay đổi thông tin kết nối.

### Build & Run
```bash
./mvnw spring-boot:run
```

## Tài khoản mẫu
| Username | Password | Role |
|----------|----------|------|
| admin | 123456 | ADMIN |
| user1 | 123456 | USER |
| user2 | 123456 | USER |

## API Documentation
- Swagger UI: http://localhost:8080/swagger-ui.html
- OpenAPI JSON: http://localhost:8080/api-docs

## Cấu trúc project

```
src/main/java/com/moviebooking/
├── config/          # Security, CORS, Redis, Swagger, VNPay config
├── controller/      # REST API endpoints
├── dto/
│   ├── request/     # Request DTOs
│   └── response/    # Response DTOs
├── entity/          # JPA Entities
├── enums/           # Role, BookingStatus, PaymentMethod, SeatType
├── exception/       # Global exception handler + custom exceptions
├── mapper/          # MapStruct mappers
├── repository/      # Spring Data JPA repositories
├── security/        # JWT filter, provider, UserDetailsService
└── service/
    └── impl/        # Service implementations
```
