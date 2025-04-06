# CRUD
# Colt Uhlenhopp
# Capstone Project

from flask import request, jsonify
from config import app, db
from models import Contact, TeeTimeQueue
import threading
import time



@app.route("/contacts", methods=["GET"])
def get_contacts():
    contacts = Contact.query.all()
    json_contacts = list(map(lambda x: x.to_json(), contacts))
    return jsonify({"contacts": json_contacts})


@app.route("/create_contact", methods=["POST"])
def create_contact():
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")

    if not first_name or not last_name or not email:
        return (
            jsonify({"message": "You must include a first name, last name and email"}),
            400,
        )

    new_contact = Contact(first_name=first_name, last_name=last_name, email=email)
    try:
        db.session.add(new_contact)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400

    return jsonify({"message": "User created!"}), 201


@app.route("/update_contact/<int:user_id>", methods=["PATCH"])
def update_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    contact.first_name = data.get("firstName", contact.first_name)
    contact.last_name = data.get("lastName", contact.last_name)
    contact.email = data.get("email", contact.email)

    db.session.commit()

    return jsonify({"message": "Usr updated."}), 200

@app.route("/join_queue", methods=["POST"])
def join_queue():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    course = data.get("course")
    group_size = data.get("group_size")

    if not name or not email or not course or not group_size:
        return jsonify({"message": "All fields are required"}), 400

    new_entry = TeeTimeQueue(name=name, email=email, course=course, group_size=group_size)
    db.session.add(new_entry)
    db.session.commit()

    queue = TeeTimeQueue.query.filter_by(course=course).order_by(TeeTimeQueue.timestamp).all()
    position = [q.id for q in queue].index(new_entry.id) + 1

    return jsonify({
        "message": "Successfully joined the queue!",
        "position": position
    }), 201

@app.route("/get_queue/<course>", methods=["GET"])
def get_queue(course):
    queue = TeeTimeQueue.query.filter_by(course=course).order_by(TeeTimeQueue.timestamp).all()
    queue_list = []

    for index, entry in enumerate(queue):
        queue_list.append({
            "name": entry.name,
            "group_size": entry.group_size,
            "wait_time": index * 8  # Each group takes ~8 mins
        })

    return jsonify(queue_list), 200



@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200

def remove_first_in_queue():
    while True:
        time.sleep(480)  # 8 minutes in seconds
        with app.app_context():
            first_entry = TeeTimeQueue.query.order_by(TeeTimeQueue.timestamp).first()
            if first_entry:
                db.session.delete(first_entry)
                db.session.commit()
                print(f"Removed {first_entry.name} from the queue.")

threading.Thread(target=remove_first_in_queue, daemon=True).start()


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True)