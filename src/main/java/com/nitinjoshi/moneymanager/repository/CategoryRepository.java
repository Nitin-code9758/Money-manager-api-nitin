package com.nitinjoshi.moneymanager.repository;

import com.nitinjoshi.moneymanager.dto.CategoryDTO;
import com.nitinjoshi.moneymanager.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<CategoryEntity, Long> {


    List<CategoryEntity> findByProfileId(Long ProfileId);
    Optional<CategoryEntity> findByIdAndProfileId(Long categoryId, Long profileId);

    //select * from tbl_categories where type = ?1 and profile_id = ?2
    List<CategoryEntity> findByTypeAndProfileId(String type, Long profileId);

    Boolean existsByNameAndProfileId(String name, Long profileId);

}
