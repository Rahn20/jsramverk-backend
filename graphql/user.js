/**
 * graphql user type
 */

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList
} = require('graphql');


const UserDocsType = new GraphQLObjectType({
    name: 'UserDocument',
    description: 'This represent a user document',
    fields: () => ({
        _id: { type: GraphQLString },
        allowed_users: {type:  new GraphQLList(GraphQLString)},
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represent a user',
    fields: () => ({
        _id: { type:  new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        docs: { type: new GraphQLNonNull(new GraphQLList(UserDocsType)) }
    })
});


module.exports = UserType;
