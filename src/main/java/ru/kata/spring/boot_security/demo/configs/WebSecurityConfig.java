package ru.kata.spring.boot_security.demo.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig {
    private final SuccessUserHandler successUserHandler;
    private final UserDetailsService userService;
    private final AuthenticationConfiguration configuration;

    @Autowired
    public WebSecurityConfig(SuccessUserHandler successUserHandler, UserDetailsService userService, AuthenticationConfiguration configuration) {
        this.successUserHandler = successUserHandler;
        this.userService = userService;
        this.configuration = configuration;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http  // Доступ только для не зарегистрированных пользователей
                .authorizeRequests()
                // Доступ разрешен всем пользователей
                .antMatchers("/", "/auth/login", "/auth/registration").permitAll()
                // Все остальные страницы требуют аутентификации
                .anyRequest().authenticated()
                .and()
                // Перенаправление на главную страницу после успешного входа в зависимости от роли
                .formLogin()
                .loginPage("/auth/login")
                .loginProcessingUrl("/process_url")
                .successHandler(successUserHandler)
                .failureUrl("/auth/login?error")
                .permitAll()
                .and()
                // Выход с авторизации
                .logout()
                // Стереть данные сеанса и кукис
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                // Переход по указанному Url
                .logoutUrl("/logout")
                // Переход по указанному Url после выхода из сессии
                .logoutSuccessUrl("/auth/login")
                // Доступно для всех
                .permitAll();
        return http.build();
    }

    @Bean
    AuthenticationManager authenticationManager() throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Autowired
    void configure(AuthenticationManagerBuilder builder) throws Exception {
        builder.userDetailsService(userService).passwordEncoder(new BCryptPasswordEncoder());
    }

    @Bean
    public BCryptPasswordEncoder getBCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}