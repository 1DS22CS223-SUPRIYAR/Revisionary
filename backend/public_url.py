from pyngrok import ngrok

# Start an ngrok tunnel on port 5000
public_url = ngrok.connect(5000).public_url
print(f"Ngrok Tunnel URL: {public_url}")
