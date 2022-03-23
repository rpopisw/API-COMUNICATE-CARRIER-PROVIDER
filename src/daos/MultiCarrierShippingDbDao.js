const MysqlCloudDatabase = require('../data-repository/databases/mysql-cloud.databases')
const Query = require('../supports/query.constants')
const SearchCarrierDbResponseDto = require('../dtos/SearchCarrierDbResponseDto')


const getCarrierApiInformation = async (nameCarrier) => {
      const db = MysqlCloudDatabase.getInstance()
      const searchCarrierDbResponseDto = new SearchCarrierDbResponseDto({})
      const result = await db.executeQuery({
            statement: Query.SEARCH_CARRIER,
            values: { name: nameCarrier.carrier },
            target: searchCarrierDbResponseDto
      })
      return result.data
}

const getDataMarterLabelShipping = async (id)=>{
      const db = MysqlCloudDatabase.getInstance()
      const result = await db.executeQuery({
            statement: Query.SEARCH_MASTER_LABEL_SHIPPING,
            values: { id },
      })
      return result.data[0].code.label
}

const saveMasterLabelShipping = async (parameters)=>{
      const db = MysqlCloudDatabase.getInstance()
      return await db.executeInsert({
            statement: Query.INSERT_MASTER_LABEL_SHIPPING,
            values: parameters,
      })
}

const updateStatusMasterLabelShipping = async (parameters)=>{
      const db = MysqlCloudDatabase.getInstance()
      return await db.executeQuery({
            statement: Query.UPDATED_STATUS_MASTER_LABEL_SHIPPING,
            values: parameters,
      })
}

const updateUrlMasterLabelShipping = async (id,url)=>{
      const db = MysqlCloudDatabase.getInstance()
      return await db.executeQuery({
            statement: Query.UPDATED_URL_MASTER_LABEL_SHIPPING,
            values: {id,url},
      })
}

module.exports = {
      getCarrierApiInformation,
      saveMasterLabelShipping,
      updateStatusMasterLabelShipping,
      getDataMarterLabelShipping,
      updateUrlMasterLabelShipping
}