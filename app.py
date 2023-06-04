from flask import Flask
app = Flask(__name__)

from templates.views import main
from PID.views import pid

app.register_blueprint(main,template_folder='templates')
app.register_blueprint(pid,template_folder='templates',static_folder="static", url_prefix="/pid")

if __name__=='__main__':
    app.run(debug=True)