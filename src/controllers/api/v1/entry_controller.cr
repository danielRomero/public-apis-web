class Api::V1::EntryController < Api::V1::ApplicationController
  def index
    entries = Entry.all("ORDER BY category ASC LIMIT ? OFFSET ?", [Entry::PER_PAGE, obtain_offset(params)])
    data = {
      count: entries.size,
      page:  (params[:page]?.nil? ? 0 : params[:page].to_i),
      total: Entry.all.size,
      data:  entries,
    }
    respond_with { json data.to_json }
  end

  def categories
    entries_grouped = Entry.all("ORDER BY category ASC").group_by { |entry| entry.category }
    categories = entries_grouped.keys
    data = {
      count: categories.size,
      total: categories.size,
      data:  categories,
    }
    respond_with { json data.to_json }
  end

  def by_category
    if valid_params?([:category])
      entries = Entry.all("WHERE category = ? ORDER BY category ASC", params[:category])
      data = {
        count: entries.size,
        total: entries.size,
        data:  entries,
      }
      respond_with { json data.to_json }
    else
      respond_invalid_params([:page])
    end
  end

  def search
    if valid_params?([:q]) && !params[:q].to_s.empty?
      if params[:q].size >= 3
        entries = Entry.search(params[:q], obtain_offset(params))
        data = {
          count: entries.size,
          total: entries.size,
          data:  entries,
        }
      else
        data = {error: "Params :q must be have more than 3 chars"}
      end
      respond_with { json data.to_json }
    else
      respond_invalid_params([:q])
    end
  end

  # Private #

  private def valid_params?(p = [] of ElementType)
    valid? = true
    p.each do |params_key|
      if params[params_key]?.nil?
        valid? = false
        break
      end
    end
    valid?
  end

  private def respond_invalid_params(p = [] of ElementType)
    response = {error: "Missing params keys: #{p}"}
    respond_with { json response.to_json }
  end

  private def obtain_offset(params)
    params[:page]?.nil? ? 0 : (params[:page].to_i * Entry::PER_PAGE)
  end
end
