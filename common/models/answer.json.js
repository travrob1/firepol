// {
//   "name": "Answer",
//   "base": "PersistedModel",
//   "idInjection": true,
//   "accessTokenEnableCtxOption": true,
//   "options": {
//     "validateUpsert": true
//   },
//   "properties": {
//     "liklihood": {
//       "type": "number",
//       "required": true
//     },
//     "liklihoodAcceptance": {
//       "type": "number",
//       "required": false
//     },
//     "decisionCertainty": {
//       "type": "number",
//       "required": true
//     },
//     "time": {
//       "type": "date",
//       "required": true
//     }
//   },
//   "validations": [],
//   "relations": {
//     "FirepolUser": {
//       "type": "belongsTo",
//       "model": "FirepolUser",
//       "foreignKey": "ownerId"
//     }
//   },
//   "acls": [
//     {
//       "principalType": "ROLE",
//       "principalId": "$everyone",
//       "permission": "DENY"
//     },
//     {
//       "accessType": "READ",
//       "principalType": "ROLE",
//       "principalId": "admin",
//       "permission": "ALLOW"
//     },
//     {
//       "accessType": "WRITE",
//       "principalType": "ROLE",
//       "principalId": "admin",
//       "permission": "ALLOW"
//     }
//   ],
//   "methods": {}
// }
