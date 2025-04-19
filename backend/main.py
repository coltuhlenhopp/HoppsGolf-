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

@app.route('/get_queue/<course>', methods=['GET'])
def get_queue(course):
    queue = TeeTimeQueue.query.filter_by(course=course).order_by(TeeTimeQueue.timestamp).all()
    result = []

    for entry in queue:
        wait_time = queue.index(entry) * 8  # 8 minutes per group
        result.append({
            'id': entry.id,  # ✅ This is the critical part!
            'name': entry.name,
            'email': entry.email,
            'group_size': entry.group_size,
            'wait_time': wait_time,
        })

    return jsonify(result)

@app.route("/delete_contact/<int:user_id>", methods=["DELETE"])
def delete_contact(user_id):
    contact = Contact.query.get(user_id)

    if not contact:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(contact)
    db.session.commit()

    return jsonify({"message": "User deleted!"}), 200

@app.route('/delete_entry/<int:entry_id>', methods=['POST'])  # ⬅️ CHANGE: use POST instead of DELETE
def delete_entry(entry_id):
    entry = TeeTimeQueue.query.get(entry_id)
    if not entry:
        return jsonify({'message': 'Entry not found'}), 404

    db.session.delete(entry)
    db.session.commit()
    print(f"Deleted entry with ID: {entry_id}")  # ✅ Optional: logging
    return jsonify({'message': 'Entry deleted successfully'}), 200


# Move up in queue
@app.route('/move_up/<int:entry_id>', methods=['POST'])
def move_up(entry_id):
    entry = TeeTimeQueue.query.get(entry_id)
    if not entry:
        return jsonify({'message': 'Entry not found'}), 404

    queue = TeeTimeQueue.query.filter_by(course=entry.course).order_by(TeeTimeQueue.timestamp).all()
    for index, current_entry in enumerate(queue):
        if current_entry.id == entry_id and index > 0:
            prev_entry = queue[index - 1]
            current_entry.timestamp, prev_entry.timestamp = prev_entry.timestamp, current_entry.timestamp
            db.session.commit()
            return jsonify({'message': 'Entry moved up successfully'}), 200

    return jsonify({'message': 'Unable to move entry up'}), 400

# Move down in queue
@app.route('/move_down/<int:entry_id>', methods=['POST'])
def move_down(entry_id):
    entry = TeeTimeQueue.query.get(entry_id)
    if not entry:
        return jsonify({'message': 'Entry not found'}), 404

    queue = TeeTimeQueue.query.filter_by(course=entry.course).order_by(TeeTimeQueue.timestamp).all()
    for index, current_entry in enumerate(queue):
        if current_entry.id == entry_id and index < len(queue) - 1:
            next_entry = queue[index + 1]
            current_entry.timestamp, next_entry.timestamp = next_entry.timestamp, current_entry.timestamp
            db.session.commit()
            return jsonify({'message': 'Entry moved down successfully'}), 200

    return jsonify({'message': 'Unable to move entry down'}), 400



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