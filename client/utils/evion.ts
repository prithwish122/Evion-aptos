export const EVION_ABI = {
    
 
  "address": "0xcb5bfe5908c48ec1631ad88a6d61b8e487e9c4bde9285ce74af8320a2f1a2ee5",
  "name": "Evion",
  "friends": [],
  "exposed_functions": [
    {
      "name": "initialize",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": []
    },
    {
      "name": "owner",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "address"
      ]
    },
    {
      "name": "transfer",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "name",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::string::String"
      ]
    },
    {
      "name": "symbol",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::string::String"
      ]
    },
    {
      "name": "decimals",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "u8"
      ]
    },
    {
      "name": "balance",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "u64"
      ]
    },
    {
      "name": "mint",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "register",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer"
      ],
      "return": []
    },
    {
      "name": "total_supply",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [],
      "return": [
        "0x1::option::Option<u128>"
      ]
    },
    {
      "name": "donate",
      "visibility": "public",
      "is_entry": true,
      "is_view": false,
      "generic_type_params": [],
      "params": [
        "&signer",
        "address",
        "u64"
      ],
      "return": []
    },
    {
      "name": "is_registered",
      "visibility": "public",
      "is_entry": false,
      "is_view": true,
      "generic_type_params": [],
      "params": [
        "address"
      ],
      "return": [
        "bool"
      ]
    }
  ],
  "structs": [
    {
      "name": "Capabilities",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "mint_cap",
          "type": "0x1::coin::MintCapability<0xcb5bfe5908c48ec1631ad88a6d61b8e487e9c4bde9285ce74af8320a2f1a2ee5::Evion::EvionToken>"
        },
        {
          "name": "burn_cap",
          "type": "0x1::coin::BurnCapability<0xcb5bfe5908c48ec1631ad88a6d61b8e487e9c4bde9285ce74af8320a2f1a2ee5::Evion::EvionToken>"
        },
        {
          "name": "owner",
          "type": "address"
        }
      ]
    },
    {
      "name": "EvionToken",
      "is_native": false,
      "is_event": false,
      "abilities": [
        "key"
      ],
      "generic_type_params": [],
      "fields": [
        {
          "name": "dummy_field",
          "type": "bool"
        }
      ]
    }
  ]


} as const;