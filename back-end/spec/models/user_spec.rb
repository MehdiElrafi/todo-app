require 'rails_helper'

RSpec.describe User, type: :model do
  describe "associations" do
    it { expect(described_class.reflect_on_association(:sessions).macro).to eq(:has_many) }
  end

  describe "password security" do
    let(:user) { build(:user) }

    it "is valid with a password and password confirmation" do
      expect(user).to be_valid
    end

    it "is invalid without a password" do
      user.password = nil
      expect(user).not_to be_valid
    end

    it "authenticates with correct password" do
      user.save!
      expect(user.authenticate("password123")).to eq(user)
    end

    it "does not authenticate with incorrect password" do
      user.save!
      expect(user.authenticate("wrongpassword")).to be_falsey
    end
  end

  describe "email normalization" do
    it "downcases and strips email_address before saving" do
      user = create(:user, email_address: "  Test@Example.COM ")
      expect(user.email_address).to eq("test@example.com")
    end
  end
end
