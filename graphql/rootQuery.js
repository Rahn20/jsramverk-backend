/**
 * graphql query types
 */

let data = require('../src/data');
let users = require('../src/users.js');

const DocumentType = require('./document.js');
const UserType = require('./user.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList
} = require('graphql');


const RootQueryType = new GraphQLObjectType ({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        getDocs: {
            type: new GraphQLList(DocumentType.documentType),
            description: 'Get all documents',
            resolve: async () => {
                return await data.getAllDocs();
            }
        },

        doc: {
            type: new GraphQLList(DocumentType.documentType),
            description: 'Get a specific document',
            args: {
                _id: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                return await data.showSpecificDoc(args._id);
            }
        },

        reset: {
            type: DocumentType.data,
            description: 'reset documents',
            resolve: async () => {
                return await data.resetCollection();
            }
        },

        getUsers: {
            type: new GraphQLList(UserType),
            description: 'Get all users',
            resolve: async () => {
                return await users.getAllUsers();
            }
        },

        user: {
            type: new GraphQLList(UserType),
            description: 'Get a specific user',
            args: {
                _id: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                return await users.getSpecificUser(args._id);
            }
        },

        userDocs: {
            type: new GraphQLList(DocumentType.documentType),
            description: 'Get users documents',
            args: {
                _id: { type: GraphQLString }
            },
            resolve: async (parent, args) => {
                return await users.getUserDocs(args._id);
            }
        }
    }),
});


module.exports = RootQueryType;
