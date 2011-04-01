# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_ding00_session',
  :secret      => 'abbe9a36f4fa444b09b487e968dff354c2daff62f445265dccee75f4a3fb2396a2d3e3bdac4706b47bfcb59c320761286de39d7dc27776e0e3d0db8593291bc7'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
ActionController::Base.session_store = :active_record_store
