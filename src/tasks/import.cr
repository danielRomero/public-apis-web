# Run: crystal src/tasks/import.cr
require "../../config/application.cr"
require "http/client"
require "json"

ENTRIES_URL = "https://raw.githubusercontent.com/toddmotto/public-apis/master/json/entries.json"

def build_and_save_entry(json_entry)
  entry = Entry.new

  entry.api = json_entry["API"].as_s?
  entry.auth = json_entry["Auth"].as_s?
  entry.category = json_entry["Category"].as_s?
  entry.description = json_entry["Description"].as_s?
  entry.https = json_entry["HTTPS"].as_bool?
  entry.link = json_entry["Link"].as_s?

  entry.valid? && entry.save
end

# REQUEST
response = HTTP::Client.get(ENTRIES_URL, headers: HTTP::Headers{"User-Agent" => "AwesomeApp"})

if response.success?
  # PARSE RESPONSE
  parsed_response = JSON.parse(response.body)
  puts "Entries in JSON: #{parsed_response["count"]}"

  # BUILD ENTRIES
  Entry.clear unless parsed_response["count"].as_i.zero? # truncate the table
  parsed_response["entries"].each do |json_entry|
    build_and_save_entry(json_entry)
  end

  puts "Total entries in db: #{Entry.all.size}"
else
  puts "Failed request"
  puts response.status_code
  puts response.status_message
end
