require "granite_orm/adapter/pg"

class Entry < Granite::ORM::Base
  adapter pg
  table_name entries

  # id : Int64 primary key is created for you
  field api : String
  field auth : String
  field category : String
  field description : String
  field https : Bool
  field link : String
  timestamps
end
