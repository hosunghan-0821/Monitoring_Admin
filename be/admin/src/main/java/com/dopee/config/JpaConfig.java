package com.dopee.config;

import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;

/**
 * 모듈로 분리된 monitor 엔티티/레포지토리를 스캔하고,
 */
@Configuration
@EnableTransactionManagement
@ComponentScan(basePackages = {"com.dopee", "module.database"})
@EntityScan(basePackages = {"module.database.entity"})
@EnableJpaRepositories(
        basePackages = {"module.database"}
//        entityManagerFactoryRef = "monitorEntityManagerFactory",
//        transactionManagerRef = "monitorTransactionManager"
)
@RequiredArgsConstructor
public class JpaConfig {

//    private final DbConfigProperties dbConfigProperties; // 의존성 주입받아 getter로 값을 받아옴

//    @Bean
//    public DataSource dataSource() {
//        DriverManagerDataSource dataSource = new DriverManagerDataSource();
//        dataSource.setUsername(dbConfigProperties.getUsername());
//        dataSource.setPassword(dbConfigProperties.getPassword());
//        return dataSource;
//    }
//
//    @Bean(name = "monitorEntityManagerFactory")
//    public LocalContainerEntityManagerFactoryBean entityManagerFactory(DataSource dataSource) {
//        // 1) EMF 빈 생성
//        LocalContainerEntityManagerFactoryBean emf = new LocalContainerEntityManagerFactoryBean();
//
//        // 2) JDBC 설정
//        emf.setDataSource(dataSource);
//
//        // 3) 엔티티 스캔 패키지
//        emf.setPackagesToScan("module.database");
//
//        // 4) JPA 벤더 어댑터 설정 (Hibernate)
//        HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
//        vendorAdapter.setDatabasePlatform("org.hibernate.dialect.MySQL8Dialect");
//        emf.setJpaVendorAdapter(vendorAdapter);
//
//        // (선택) 프로바이더를 명시적으로 지정하고 싶다면
//        // emf.setPersistenceProviderClass(org.hibernate.jpa.HibernatePersistenceProvider.class);
//
//        return emf;
//    }
//
//    // TransactionManager 빈도 꼭 등록하세요
//    @Bean(name = "monitorTransactionManager")
//    public PlatformTransactionManager transactionManager(
//            LocalContainerEntityManagerFactoryBean emf) {
//        return new JpaTransactionManager(emf.getObject());
//    }

}
