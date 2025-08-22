require "rails_helper"

RSpec.describe Current, type: :model do
  describe "attributes" do
    let(:user) { build(:user) }

    it "can store a session" do
      session = Session.create!(user: user)

      Current.session = session

      expect(Current.session).to eq(session)
    end

    it "can access user through the delegated method" do
      session = Session.create!(user: user)

      Current.session = session

      expect(Current.user).to eq(user)
    end

    it "returns nil for user if session is not set" do
      Current.session = nil

      expect(Current.user).to be_nil
    end
  end
end
