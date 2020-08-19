'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
        SELECT
            OrderID AS "Order Id",
            SUM(UnitPrice * Quantity) AS "Order Total Price",
            ROUND(
               Sum(Discount * Quantity) / SUM(UnitPrice * Quantity) * 100, 3
            ) AS "Total Order Discount, %"
        FROM OrderDetails
        GROUP BY OrderID
        ORDER BY OrderID DESC
    `);
    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
        SELECT
           CustomerId,
           CompanyName
        FROM Customers
        WHERE Country = 'USA' AND Fax IS NULL
    `);
    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
        SELECT
            CustomerID AS 'Customer Id',
            COUNT(OrderID) AS 'Total number of Orders',
            ROUND(
                COUNT(OrderID) / (SELECT COUNT(OrderId) FROM Orders) * 100, 5
            ) AS '% of all orders'
        FROM Orders
        GROUP BY CustomerID
        ORDER BY COUNT(OrderID) DESC, CustomerID ASC
    `);
    return result[0];
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
        SELECT
           ProductID AS ProductId,
           ProductName,
           QuantityPerUnit
        FROM Products
        WHERE ProductName REGEXP '^[A-F].*'
        ORDER BY ProductName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
        SELECT
            Products.ProductName AS ProductName,
            Categories.CategoryName AS CategoryName,
            Suppliers.CompanyName AS SupplierCompanyName
        FROM Products
            INNER JOIN Categories ON Products.CategoryID=Categories.CategoryID 
            INNER JOIN Suppliers ON Products.SupplierID=Suppliers.SupplierID
        ORDER BY Products.ProductName, Suppliers.CompanyName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
        SELECT
            e.EmployeeID AS EmployeeId,
            CONCAT(e.FirstName, ' ', e.LastName) AS FullName,
            IFNULL((
                SELECT 
                    CONCAT(FirstName, ' ', LastName) 
                FROM Employees
                WHERE EmployeeID=e.ReportsTo
            ), '-') AS ReportsTo
        FROM Employees e
        ORDER BY e.EmployeeID
    `);
    return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
        SELECT
            Categories.CategoryName AS CategoryName,
            products.QuantityPerUnit AS TotalNumberOfProducts
        FROM (
            SELECT
                CategoryID,
                COUNT(ProductID) AS QuantityPerUnit
            FROM Products
            GROUP BY CategoryID
            ) products
            RIGHT JOIN Categories ON products.CategoryID=Categories.CategoryID 
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
        SELECT
           CustomerID,
           ContactName
        FROM Customers
        WHERE ContactName REGEXP '^F..n.*'
    `);
    return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
        SELECT
           ProductID,
           ProductName
        FROM Products
        WHERE Discontinued
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
        SELECT
           ProductName,
           UnitPrice
        FROM Products
        WHERE UnitPrice BETWEEN 5 AND 15
        ORDER BY UnitPrice, ProductName
    `);
    return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
        SELECT
           p.ProductName,
           p.UnitPrice
        FROM (
            SELECT 
                ProductName,
                UnitPrice
            FROM Products
            ORDER BY UnitPrice DESC
            LIMIT 20
            ) p
        ORDER BY p.UnitPrice, p.ProductName
        
    `);
    return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
        SELECT
            COUNT(ProductID) AS TotalOfCurrentProducts,
            COUNT(  CASE 
                        WHEN Discontinued 
                        THEN 1 
                        ELSE NULL 
                    END) AS TotalOfDiscontinuedProducts
            
        FROM Products
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
        SELECT
           ProductName AS ProductName,
           UnitsOnOrder AS UnitsOnOrder,
           UnitsInStock AS UnitsInStock
        FROM Products
        WHERE UnitsInStock<UnitsOnOrder
    `);
    return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
        SELECT
            SUM( IF( MONTH(OrderDate)=1 AND YEAR(OrderDate)=1997, 1, 0) ) AS January,
            SUM( IF( MONTH(OrderDate)=2 AND YEAR(OrderDate)=1997, 1, 0) ) AS February,
            SUM( IF( MONTH(OrderDate)=3 AND YEAR(OrderDate)=1997, 1, 0) ) AS March,
            SUM( IF( MONTH(OrderDate)=4 AND YEAR(OrderDate)=1997, 1, 0) ) AS April,
            SUM( IF( MONTH(OrderDate)=5 AND YEAR(OrderDate)=1997, 1, 0) ) AS May,
            SUM( IF( MONTH(OrderDate)=6 AND YEAR(OrderDate)=1997, 1, 0) ) AS June,
            SUM( IF( MONTH(OrderDate)=7 AND YEAR(OrderDate)=1997, 1, 0) ) AS July,
            SUM( IF( MONTH(OrderDate)=8 AND YEAR(OrderDate)=1997, 1, 0) ) AS August,
            SUM( IF( MONTH(OrderDate)=9 AND YEAR(OrderDate)=1997, 1, 0) ) AS September,
            SUM( IF( MONTH(OrderDate)=10 AND YEAR(OrderDate)=1997, 1, 0) ) AS October,
            SUM( IF( MONTH(OrderDate)=11 AND YEAR(OrderDate)=1997, 1, 0) ) AS November,
            SUM( IF( MONTH(OrderDate)=12 AND YEAR(OrderDate)=1997, 1, 0) ) AS December
        FROM Orders 
    `);
    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
        SELECT
           OrderID,
           CustomerID,
           ShipCountry
        FROM Orders
        WHERE ShipPostalCode IS NOT NULL
    `);
    return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
        SELECT
           Categories.CategoryName AS CategoryName,
           products.Price AS AvgPrice
        FROM (
            SELECT
                CategoryID,
                AVG(UnitPrice) AS Price
            FROM Products
            GROUP BY CategoryID
            ) products
            RIGHT JOIN Categories ON products.CategoryID=Categories.CategoryID
            ORDER BY products.Price DESC, Categories.CategoryName
    `);
    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
        SELECT
            DATE_FORMAT(OrderDate, '%Y-%m-%d %T') AS OrderDate,
            COUNT(OrderID) AS 'Total Number of Orders'
        FROM Orders
        WHERE YEAR(OrderDate)=1998
        GROUP BY OrderDate
        
    `);
    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
    SELECT
        Customers.CustomerID AS CustomerID,
        Customers.CompanyName AS CompanyName,
        TotalAmount.TotalOrdersAmount AS 'TotalOrdersAmount, $'
    FROM Customers
    INNER JOIN (
        SELECT
            Orders.CustomerID AS CustomerID,
            SUM(TotalOrders.TotalPrice) AS TotalOrdersAmount
        FROM Orders
        INNER JOIN (
                SELECT
                    OrderID,
                    SUM(UnitPrice * Quantity) AS TotalPrice
                FROM OrderDetails
                GROUP BY OrderID
            ) TotalOrders ON Orders.OrderId = TotalOrders.OrderID
        GROUP BY Orders.CustomerID
        HAVING TotalOrdersAmount>10000
    ) TotalAmount ON TotalAmount.CustomerID=Customers.CustomerID
    ORDER BY TotalAmount.TotalOrdersAmount DESC, CustomerID
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
    SELECT
        Employees.EmployeeID AS EmployeeID,
        CONCAT(Employees.FirstName, ' ', Employees.LastName) AS 'Employee Full Name',
        TotalAmount.TotalOrdersAmount AS 'Amount, $'
    FROM Employees
    INNER JOIN (
        SELECT
            Orders.EmployeeID AS EmployeeID,
            SUM(TotalOrders.TotalPrice) AS TotalOrdersAmount
        FROM Orders
        INNER JOIN (
            SELECT
                OrderID,
                SUM(UnitPrice * Quantity) AS TotalPrice
            FROM OrderDetails
            GROUP BY OrderID
            ) TotalOrders ON Orders.OrderId = TotalOrders.OrderID
        GROUP BY Orders.EmployeeID
    ) TotalAmount ON TotalAmount.EmployeeID=Employees.EmployeeID
    ORDER BY TotalAmount.TotalOrdersAmount DESC
    LIMIT 1
    `);
    return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
                    SELECT
                        OrderID,
                        SUM(UnitPrice * Quantity) AS 'Maximum Purchase Amount, $'
                    FROM OrderDetails
                    GROUP BY OrderID
                    ORDER BY SUM(UnitPrice * Quantity) DESC
                    LIMIT 1
                    
    `);
    return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
        let result = await db.query(`
            SELECT DISTINCT
                Customers.CompanyName AS CompanyName,
                Products.ProductName AS ProductName,
                MaxCustomers.MaxPrice AS PricePerItem
            FROM (
                SELECT
                    OrderID,
                    MAX(UnitPrice) AS MaxPrice
                FROM OrderDetails
                GROUP BY OrderID
            ) MaxForOrders 
            INNER JOIN OrderDetails ON MaxForOrders.OrderID=OrderDetails.OrderID AND MaxForOrders.MaxPrice=OrderDetails.UnitPrice
            INNER JOIN Orders ON Orders.OrderID=MaxForOrders.OrderID        
            INNER JOIN (
                    SELECT
                        Orders.CustomerID,
                        MAX(MaxProducts.MaxPrice) AS MaxPrice
                    FROM Orders
                    INNER JOIN (
                        SELECT
                            OrderID,
                            MAX(UnitPrice) AS MaxPrice
                        FROM OrderDetails
                        GROUP BY OrderID
                        ) MaxProducts ON MaxProducts.OrderID=Orders.OrderID
                    GROUP BY CustomerID
            ) MaxCustomers ON Orders.CustomerID=MaxCustomers.CustomerID AND MaxForOrders.MaxPrice=MaxCustomers.MaxPrice
            INNER JOIN Products ON Products.ProductID=OrderDetails.ProductID
            INNER JOIN Customers ON MaxCustomers.CustomerID=Customers.CustomerID
            ORDER BY MaxCustomers.MaxPrice DESC, Customers.CompanyName, Products.ProductName
                        
    `);
    return result[0];
}               

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
