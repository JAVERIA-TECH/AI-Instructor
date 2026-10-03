import os
import streamlit as st

st.set_page_config(page_title="Ustaad AI", page_icon="🎓", layout="wide")

app_url = os.getenv("USTAAD_APP_URL", "http://localhost:5173")

st.markdown("# 🎓 Ustaad AI")
st.markdown("### Your Personal Multilingual AI Teacher")
st.info("The production application runs on React + Node.js. This Streamlit page is a lightweight deployment/demo shell that embeds the same web app; no AI logic is implemented in Python.")

st.components.v1.iframe(app_url, height=850, scrolling=True)
