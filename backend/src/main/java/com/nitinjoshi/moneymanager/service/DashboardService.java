package com.nitinjoshi.moneymanager.service;

import com.nitinjoshi.moneymanager.dto.ExpenseDTO;
import com.nitinjoshi.moneymanager.dto.IncomeDTO;
import com.nitinjoshi.moneymanager.dto.RecentTransactionDTO;
import com.nitinjoshi.moneymanager.entity.ProfileEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Stream.concat;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final ProfileService profileService;

    public Map<String, Object> getDashboardData() {

        ProfileEntity profile = profileService.getCurrentProfile();

        Map<String, Object> returnValue = new LinkedHashMap<>();

        List<IncomeDTO> latestIncomes =
                incomeService.getLatest5IncomesForCurrentUser();

        List<ExpenseDTO> latestExpenses =
                expenseService.getLatest5ExpensesForCurrentUser();

        List<RecentTransactionDTO> recentTransactions =
                concat(
                        latestIncomes.stream().map(income ->
                                RecentTransactionDTO.builder()
                                        .id(income.getId())
                                        .profileId(profile.getId())
                                        .icon(income.getIcon())
                                        .name(income.getName())
                                        .amount(income.getAmount())
                                        .date(income.getDate())
                                        .createdAt(income.getCreatedAt())
                                        .updatedAt(income.getUpdatedAt())
                                        .type("income")
                                        .build()),

                        latestExpenses.stream().map(expense ->
                                RecentTransactionDTO.builder()
                                        .id(expense.getId())
                                        .profileId(profile.getId())
                                        .icon(expense.getIcon())
                                        .name(expense.getName())
                                        .amount(expense.getAmount())
                                        .date(expense.getDate())
                                        .createdAt(expense.getCreatedAt())
                                        .updatedAt(expense.getUpdatedAt())
                                        .type("expense")
                                        .build())
                )
                        .sorted((a, b) -> {

                            int cmp = b.getDate().compareTo(a.getDate());

                            if (cmp == 0 &&
                                    a.getCreatedAt() != null &&
                                    b.getCreatedAt() != null) {

                                return b.getCreatedAt()
                                        .compareTo(a.getCreatedAt());
                            }

                            return cmp;
                        })
                        .collect(Collectors.toList());

        // Total Balance
        returnValue.put(
                "totalBalance",
                incomeService.getTotalIncomesForCurrentUser()
                        .subtract(
                                expenseService.getTotalExpensesForCurrentUser()
                        )
        );

        // Total Income
        returnValue.put(
                "totalIncome",
                incomeService.getTotalIncomesForCurrentUser()
        );

        // Total Expense
        returnValue.put(
                "totalExpense",
                expenseService.getTotalExpensesForCurrentUser()
        );

        // Recent 5 Expenses
        returnValue.put(
                "recent5Expenses",
                latestExpenses
        );

        // Recent 5 Incomes
        returnValue.put(
                "recent5Incomes",
                latestIncomes
        );

        // Recent Transactions
        returnValue.put(
                "recentTransactions",
                recentTransactions
        );

        return returnValue;
    }
}