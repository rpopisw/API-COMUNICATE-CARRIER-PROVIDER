module.exports = {

    SEARCH_CARRIER: `
    select name as name, url_api as url, token as token
    from carrier 
    where name = :name
    `,

    SEARCH_MASTER_LABEL_SHIPPING: `
    Select code_label from master_label_shipping where id = :id
    `,

    INSERT_MASTER_LABEL_SHIPPING: `
    insert into master_label_shipping(status,code_label,data) values ( :status, :codeLabel, :data ) 
    `,

    UPDATED_STATUS_MASTER_LABEL_SHIPPING: `
    update master_label_shipping
    set status = :status 
    where id = :id
    `,

    UPDATED_URL_MASTER_LABEL_SHIPPING: `
    update master_label_shipping
    set url_s3 = :url 
    where id = :id
    `,

}