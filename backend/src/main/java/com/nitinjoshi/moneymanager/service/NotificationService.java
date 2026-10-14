package com.nitinjoshi.moneymanager.service;

import com.nitinjoshi.moneymanager.dto.ExpenseDTO;
import com.nitinjoshi.moneymanager.entity.ProfileEntity;
import com.nitinjoshi.moneymanager.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;


    // Daily reminder at 10:00 PM
   //@Scheduled(cron = "0 * * * * *", zone = "Asia/Kolkata")
  //  @Scheduled(cron = "0 0 22 * * *", zone = "Asia/Kolkata")
    public void sendDailyIncomeExpenseReminder() {

        log.info("Job started: sendDailyIncomeExpenseReminder()");

        List<ProfileEntity> profiles = profileRepository.findAll();

        for (ProfileEntity profile : profiles) {

            String body = "Hi " + profile.getFullName() + ",<br><br>"
                    + "This is a friendly reminder to add your income and expenses for today in Money Manager.<br><br>"
                    + "<a href=\"" + frontendUrl
                    + "\" style='display:inline-block;padding:10px 20px;"
                    + "background-color:#4CAF50;color:#fff;text-decoration:none;"
                    + "border-radius:5px;font-weight:bold;'>Go to Money Manager</a>"
                    + "<br><br>Best regards,<br>Money Manager Team";

            emailService.sendEmail(
                    profile.getEmail(),
                    "Daily reminder: Add your income and expenses",
                    body
            );
        }

        log.info("Job finished: sendDailyIncomeExpenseReminder()");
    }


    // Daily expense summary at 11:00 PM
    @Scheduled(cron = "0 0 23 * * *", zone = "Asia/Kolkata")

    public void sendDailyExpenseSummary() {

        log.info("========== JOB STARTED ==========");

        List<ProfileEntity> profiles = profileRepository.findAll();

        log.info("Total profiles found: {}", profiles.size());

        for (ProfileEntity profile : profiles) {

            log.info("Checking expenses for: {}", profile.getEmail());

            List<ExpenseDTO> todaysExpenses =
                    expenseService.getExpensesForUserOnDate(
                            profile.getId(),
                            LocalDate.now()
                    );

            log.info(
                    "Today's expenses for {} = {}",
                    profile.getEmail(),
                    todaysExpenses.size()
            );

            if (!todaysExpenses.isEmpty()) {

                StringBuilder table = new StringBuilder();

                table.append(
                        "<table style='border-collapse:collapse;width:100%;'>"
                );

                table.append(
                        "<tr style='background-color:#f2f2f2;'>"
                                + "<th style='border:1px solid #ddd;padding:8px;'>S.No</th>"
                                + "<th style='border:1px solid #ddd;padding:8px;'>Name</th>"
                                + "<th style='border:1px solid #ddd;padding:8px;'>Amount</th>"
                                + "<th style='border:1px solid #ddd;padding:8px;'>Category</th>"
                                + "<th style='border:1px solid #ddd;padding:8px;'>Date</th>"
                                + "</tr>"
                );

                int i = 1;

                for (ExpenseDTO expense : todaysExpenses) {

                    table.append("<tr>");

                    table.append(
                            "<td style='border:1px solid #ddd;padding:8px;'>"
                    ).append(i++).append("</td>");

                    table.append(
                            "<td style='border:1px solid #ddd;padding:8px;'>"
                    ).append(expense.getName()).append("</td>");

                    table.append(
                            "<td style='border:1px solid #ddd;padding:8px;'>"
                    ).append(expense.getAmount()).append("</td>");

                    table.append(
                            "<td style='border:1px solid #ddd;padding:8px;'>"
                    ).append(
                            expense.getCategoryId() != null
                                    ? expense.getCategoryName()
                                    : "N/A"
                    ).append("</td>");

                    table.append(
                            "<td style='border:1px solid #ddd;padding:8px;'>"
                    ).append(LocalDate.now()).append("</td>");

                    table.append("</tr>");
                }

                table.append("</table>");

                String body =
                        "Hi " + profile.getFullName()
                                + ",<br><br>"
                                + "Here is a summary of your expenses for today:"
                                + "<br><br>"
                                + table
                                + "<br><br>"
                                + "Best regards,<br>Money Manager Team";

                log.info("Sending email to: {}", profile.getEmail());

                try {

                    emailService.sendEmail(
                            profile.getEmail(),
                            "Your daily Expense summary",
                            body
                    );

                    log.info("Email sendEmail() completed for: {}",
                            profile.getEmail());

                } catch (Exception e) {

                    log.error(
                            "EMAIL FAILED for: {}",
                            profile.getEmail(),
                            e
                    );
                }

            } else {

                log.info(
                        "No expenses found today for {}. Email not sent.",
                        profile.getEmail()
                );
            }
        }

        log.info("========== JOB FINISHED ==========");
    }
}