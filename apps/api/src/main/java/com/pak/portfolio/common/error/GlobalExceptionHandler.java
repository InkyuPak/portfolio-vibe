package com.pak.portfolio.common.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindException;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    ProblemDetail handleNotFound(NotFoundException exception, HttpServletRequest request) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, exception.getMessage());
        detail.setTitle("Resource Not Found");
        detail.setType(URI.create("https://portpolio.dev/errors/not-found"));
        detail.setProperty("path", request.getRequestURI());
        return detail;
    }

    @ExceptionHandler({MethodArgumentNotValidException.class, BindException.class, ConstraintViolationException.class})
    ProblemDetail handleValidation(Exception exception, HttpServletRequest request) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation failed");
        detail.setTitle("Validation Error");
        detail.setType(URI.create("https://portpolio.dev/errors/validation"));
        detail.setProperty("path", request.getRequestURI());
        detail.setProperty("errors", extractErrors(exception));
        return detail;
    }

    @ExceptionHandler(AccessDeniedException.class)
    ProblemDetail handleAccessDenied(AccessDeniedException exception, HttpServletRequest request) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, exception.getMessage());
        detail.setTitle("Access Denied");
        detail.setType(URI.create("https://portpolio.dev/errors/forbidden"));
        detail.setProperty("path", request.getRequestURI());
        return detail;
    }

    @ExceptionHandler(ErrorResponseException.class)
    ProblemDetail handleFramework(ErrorResponseException exception, HttpServletRequest request) {
        ProblemDetail detail = exception.getBody();
        detail.setProperty("path", request.getRequestURI());
        return detail;
    }

    @ExceptionHandler(Exception.class)
    ProblemDetail handleGeneric(Exception exception, HttpServletRequest request) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, exception.getMessage());
        detail.setTitle("Internal Server Error");
        detail.setType(URI.create("https://portpolio.dev/errors/internal"));
        detail.setProperty("path", request.getRequestURI());
        return detail;
    }

    private Map<String, String> extractErrors(Exception exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        if (exception instanceof MethodArgumentNotValidException methodArgumentNotValidException) {
            methodArgumentNotValidException.getBindingResult().getFieldErrors()
                    .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        } else if (exception instanceof BindException bindException) {
            bindException.getBindingResult().getFieldErrors()
                    .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        } else if (exception instanceof ConstraintViolationException constraintViolationException) {
            constraintViolationException.getConstraintViolations()
                    .forEach(violation -> errors.put(violation.getPropertyPath().toString(), violation.getMessage()));
        }
        return errors;
    }
}
