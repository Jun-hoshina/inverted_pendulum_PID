from flask import  render_template, Blueprint

pid = Blueprint("pid", __name__, template_folder='templates', static_folder="static")

@pid.route("/pid", methods=["GET", "POST"])
def pid_view():
    return render_template("PID.html")
