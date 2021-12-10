/**
 * graphql document type
 */

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
} = require('graphql');


const DocumentType = {
    documentType: new GraphQLObjectType({
        name: 'Document',
        description: 'This represent a document',
        fields: () => ({
            _id: { type:  new GraphQLNonNull(GraphQLString) },
            name: { type: new GraphQLNonNull(GraphQLString) },
            content: { type: new GraphQLNonNull(GraphQLString) }
        })
    }),

    data: new GraphQLObjectType({
        name: 'Data',
        description: 'This represent the data',
        fields: () => ({
            data: { type:  new GraphQLNonNull(GraphQLString) }
        })
    })
};


module.exports = DocumentType;
