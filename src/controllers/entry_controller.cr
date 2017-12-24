class EntryController < ApplicationController
  def index
    entries_grouped = Entry.all("ORDER BY category ASC").group_by { |entry| entry.category }
    render("index.ecr")
  end

  def search
    entries_grouped = Entry.search(params[:q]).group_by { |entry| entry.category }
    render("index.ecr")
  end

  def show
    if entry = Entry.find params["id"]
      render("show.ecr")
    else
      flash["warning"] = "Entry with ID #{params["id"]} Not Found"
      redirect_to "/entries"
    end
  end

  def new
    entry = Entry.new
    render("new.ecr")
  end

  def create
    entry = Entry.new(entry_params.validate!)

    if entry.valid? && entry.save
      flash["success"] = "Created Entry successfully."
      redirect_to "/entries"
    else
      flash["danger"] = "Could not create Entry!"
      render("new.ecr")
    end
  end

  def edit
    if entry = Entry.find params["id"]
      render("edit.ecr")
    else
      flash["warning"] = "Entry with ID #{params["id"]} Not Found"
      redirect_to "/entries"
    end
  end

  def update
    if entry = Entry.find(params["id"])
      entry.set_attributes(entry_params.validate!)
      if entry.valid? && entry.save
        flash["success"] = "Updated Entry successfully."
        redirect_to "/entries"
      else
        flash["danger"] = "Could not update Entry!"
        render("edit.ecr")
      end
    else
      flash["warning"] = "Entry with ID #{params["id"]} Not Found"
      redirect_to "/entries"
    end
  end

  def destroy
    if entry = Entry.find params["id"]
      entry.destroy
    else
      flash["warning"] = "Entry with ID #{params["id"]} Not Found"
    end
    redirect_to "/entries"
  end

  def entry_params
    params.validation do
      required(:api) { |f| !f.nil? }
      required(:auth) { |f| !f.nil? }
      required(:category) { |f| !f.nil? }
      required(:description) { |f| !f.nil? }
      required(:https) { |f| !f.nil? }
      required(:link) { |f| !f.nil? }
    end
  end
end
