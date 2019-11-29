import {connection} from '../util/database';
import {Category} from '../models/category';

export const selectCategories = (page: number, deleted: boolean, category: string, categoryId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        SELECT category.category_id,
            category.name,
            category.group,
            category.description,
            category.image
        FROM category
        WHERE deleted != ${deleted ? 2 : 1}
        ${category != undefined ? `AND name = '${category}'` : ''}
        ${categoryId != undefined ? `AND category_id = '${categoryId}'` : ''}
        ;`;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                const categories: Category[] = parseCategoriesFromResults(results);
                const startIndex = (page - 1) * 10;
                resolve({
                    page: page,
                    total: categories.length,
                    results: categories.splice(startIndex, 10)
                });
            }
        });
    });
};

export const insertCategory = (category: Category): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        INSERT INTO category(
            category.name,
            category.group,
            category.description,
            category.image
        ) VALUES (
            '${category.name}',
            '${category.group}',
            '${category.description}',
            '${category.image}'
        );`;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export const updateCategory = (category: Category): Promise<any> => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `
        UPDATE category
        SET category.name = '${category.name}',
            category.group = '${category.group}',
            category.description = '${category.description}',
            category.image = '${category.image}'
        WHERE category.category_id = ${category.category_id}
        ;`;
        connection.query(sqlQuery, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

export const deleteCategory = (categoryId: number): Promise<any> => {
    return new Promise((resolve, reject) => {
        const statement = `
        DELETE
        FROM category
        WHERE category.category_id = ${categoryId};
        `;
        connection.query(statement, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

const parseCategoriesFromResults = (results: any): Category[] => {
    const categories: Category[] = [];
    for (let i = 0; i < results.length; i++) {
        const category: Category = {
            category_id: results[i].category_id,
            name: results[i].name,
            group: results[i].group,
            description: results[i].description,
            image: results[i].image
        };
        categories.push(category);
    }
    return categories;
};
