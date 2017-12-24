require "granite_orm/adapter/pg"

class Entry < Granite::ORM::Base
  adapter pg
  table_name entries

  PER_PAGE = 50

  # id : Int64 primary key is created for you
  field api : String
  field auth : String
  field category : String
  field description : String
  field https : Bool
  field link : String
  timestamps

  def self.search(query, offset = nil)
    search_term = query.to_s.downcase
    params = ["%#{search_term}%", "%#{search_term}%", "%#{search_term}%"] of Int32 | String
    query = "WHERE LOWER(api) LIKE ?
         OR LOWER(category) LIKE ?
         OR LOWER(description) LIKE ?
         ORDER BY category ASC"
    unless offset.nil?
      query = "#{query} LIMIT ? OFFSET ?"
      params << Entry::PER_PAGE
      params << offset
    end
    Entry.all(query, params)
  end
end
