from PyQt5.QtWidgets import (
    QApplication,
    QHBoxLayout,
    QPushButton,
    QWidget,
    QLabel
)
from PyQt5.QtCore import pyqtSignal, pyqtSlot, QObject
import sys
from threading import Thread
import json
from flask import Flask, request, jsonify
flask_app = Flask(__name__)

class SenderObject(QObject):
    user_received = pyqtSignal(str)

sender = SenderObject()

@flask_app.route("/", methods=['POST'])
def hello_world():
    print(request.data)
    record = json.loads(request.data)

    if 'user' not in record:
        return jsonify({'status': 'FAIL'})

    sender.user_received.emit(record['user'])

    return jsonify({'user': record['user'], 'status': 'SUCCESS'})


def run_flask_app(arg):
    flask_app.run(debug=False)

class Window(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("QHBoxLayout Example")
        # Create a QHBoxLayout instance
        self.layout = QHBoxLayout()
        # Add widgets to the layout
        self.userButton = QPushButton("START")
        self.layout.addWidget(self.userButton)
        # Set the layout on the application's window
        self.setLayout(self.layout)
        sender.user_received.connect(self.set_user_name)
    
    def set_user_name(self, user):
        self.layout.addWidget(QLabel(user))


if __name__ == "__main__":
    flask_thread = Thread(target = run_flask_app, args = (10, ))
    flask_thread.setDaemon(True)
    flask_thread.start()

    app = QApplication(sys.argv)
    window = Window()
    window.show()
    sys.exit(app.exec_())
