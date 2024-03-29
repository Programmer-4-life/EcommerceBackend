class ApiFeatures{
    constructor(query , queryStr){
        this.query = query
        this.queryStr = queryStr
    }

    search(){
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i", //small i means case sensitive
            },
        }:{}
        
        this.query = this.query.find({...keyword})
        return this
    }

    filter(){
        const queryCopy = {...this.queryStr}
        // = this.queryStr krty tou object ka reference milta queryCpy mai
        //isliye we have used {...this.queryStr}

        // Removing some fields for category
        const removeFields = ["keyword" , "page" , "limit"]

        removeFields.forEach(key=>delete queryCopy[key])

        // Filter for Price and Rating
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g , key => `$${key}`)
        //for greater than equal to price etc

        this.query = this.query.find(JSON.parse(queryStr))
        //this.query = product.find()
        return this
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1
    
        //if user wants to view 2nd page products or any page products
        const skip = resultPerPage * (currentPage - 1)

        this.query = this.query.limit(resultPerPage).skip(skip)

        return this
    }
}

module.exports = ApiFeatures