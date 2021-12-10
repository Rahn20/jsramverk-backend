/**
 * graphql mutation
 */

let data = require('../src/data');
let auth = require('../src/auth.js');
let users = require('../src/users.js');

const DocumentType = require('./document.js');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} = require('graphql');


const RootMutationType = new GraphQLObjectType ({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        updateDoc: {
            type: DocumentType.data,
            description: 'Update a document',
            args: {
                docId: { type: new GraphQLNonNull(GraphQLString) },
                content: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (post, args, context) => {
                let check = auth.checkToken(context);

                if (check.email) {
                    return await data.updateData(check.email, args.content, args.docId);
                }
            }
        },

        addDoc: {
            type: DocumentType.data,
            description: 'Add a document',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                content: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (post, args, context) => {
                let check = auth.checkToken(context);

                if (check.email) {
                    return await data.createData(check.email, args);
                }
            }
        },

        deleteDoc: {
            type: DocumentType.data,
            description: 'Delete a document',
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (post, args, context) => {
                let check = auth.checkToken(context);

                if (check.email) {
                    return await data.deleteData(check.email, args.id);
                }
            }
        },

        deleteUser: {
            type: DocumentType.data,
            description: 'Delete a user',
            resolve: async (post, args, context) => {
                //return await users.deleteUser("test1@bth.se");
                let check = auth.checkToken(context);

                if (check.email) {
                    return await users.deleteUser(check.email);
                }
            }
        },

        allowUser: {
            type: DocumentType.data,
            description: 'Allow user to edit document',
            args: {
                docId: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
            },
            resolve: async (post, args, context) => {
                let check = auth.checkToken(context);

                if (check.email) {
                    return await users.allowUser(check.email, args);
                }
            }
        },

    }),
});


module.exports = RootMutationType;
