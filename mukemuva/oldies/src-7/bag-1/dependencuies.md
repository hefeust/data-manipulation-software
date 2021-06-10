

#LOOKUP
install: (async) pool role_names
select_role: (async) pool role_name --> block

#ROLE
create: name --> block
hydrate: (async)  pool uid --> block
save: (async) pool block --> uid
wrap: block
set_part: (async) pool block value
get_part: (async) pool block value
select_part: (async) pool block filter

#PART
create: value --> block
hydrate: (async)  pool uid --> block
save: (async) pool block --> uid
wrap: block
set_item: (async) pool block data
get_item: (async) pool block uid
select_items: (async) pool block filter --> [blocks]*


