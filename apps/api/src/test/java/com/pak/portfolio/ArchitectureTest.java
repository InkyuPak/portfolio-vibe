package com.pak.portfolio;

import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

import static org.assertj.core.api.Assertions.assertThat;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

@AnalyzeClasses(packages = "com.pak.portfolio")
class ArchitectureTest {

    @ArchTest
    static final ArchRule controllerShouldNotDependOnRepository =
            noClasses().that().resideInAPackage("..controller..")
                    .should().dependOnClassesThat().resideInAPackage("..repository..");

    @ArchTest
    static final ArchRule repositoryShouldNotDependOnController =
            noClasses().that().resideInAPackage("..repository..")
                    .should().dependOnClassesThat().resideInAPackage("..controller..");

    @Test
    void shouldDetectApplicationModules() {
        ApplicationModules modules = ApplicationModules.of(PortfolioApiApplication.class);
        assertThat(modules.stream().map(module -> module.getName()).toList())
                .contains("auth", "project", "site", "experience", "skill", "media", "contact");
    }
}
