export const generateCppCode = (nodes) => {
  // Base code structure with methods implemented
  const baseCode = `#include <iostream>
#include <string>
using namespace std;
//Auth:oGhostyyy
//Go to Line 122 to watch the code update, note indexing is 0 based 

struct Node {
    string data; // Data stored in the node
    Node* prev; // Pointer to the previous node
    Node* next; // Pointer to the next node

    Node(const string& value) : data(value), prev(nullptr), next(nullptr) {}
    //Constructor that initializes with the value and sets prev and next to nullptr
};

class DoublyLinkedList { //The class that represents the doubly linked list
private:
    Node* head; // Pointer to the head of the list
    Node* tail; // Pointer to the tail of the list
    int size; // Size of the list

public:
    DoublyLinkedList() : head(nullptr), tail(nullptr), size(0) {} //initialize empty list
    void insertAtBeginning(const string& value) { //function to insert at the beginning
        Node* newNode = new Node(value); // Create a new node
        if (head == nullptr) {
            head = tail = newNode; // If list is empty, set head and tail to new node
        } else {
            newNode->next = head; // Link new node to the current head
            head->prev = newNode; // Link current head's previous to new node
            head = newNode; // Update head to new node
        }
        size++; //increase the size of the list
    }

    void insertAtEnd(const string& value) {
        Node* newNode = new Node(value);
        if (tail == nullptr) {
            head = tail = newNode; // If list is empty, set head and tail to new node
        } else {
            tail->next = newNode; // Link current tail to new node
            newNode->prev = tail; // Link new nodes previous to current tail
            tail = newNode; // Update tail to new node
        }
        size++; //increase the size of the list
    }

    void insertAtPosition(const string& value, int position) {
        if (position < 0 || position > size) { // Check for valid position
            cout << "Invalid position" << endl;
            return; //Throw an error
        }

        if (position == 0) {
            insertAtBeginning(value); // Insert at the beginning
            return;
        }

        if (position == size) {
            insertAtEnd(value); // Insert at the end
            return;
        }

        Node* newNode = new Node(value); // Create a new node
        Node* current = head; // Start from the head

        for (int i = 0; i < position - 1; ++i) {
            current = current->next; // Traverse to the position
        }

        newNode->next = current->next; // Link new node to the next node
        newNode->prev = current; // Link new node's previous to current
        current->next->prev = newNode; // Link next node's previous to new node
        current->next = newNode; // Link current node to new node

        size++; //increase the size of the list
    }

    void deleteNode(const string& value) {
        if (head == nullptr) return; // List is empty

        Node* current = head;
        while (current != nullptr && current->data != value) { // Traverse the list
            current = current->next;
        }

        if (current == nullptr) return; // Node not found

        if (current == head) {
            head = head->next;  // Move head to the next node
            if (head != nullptr) head->prev = nullptr; // Update head's previous
        } else if (current == tail) {
            tail = tail->prev; // Move tail to the previous node
            if (tail != nullptr) tail->next = nullptr; // Update tail's next
        } else {
            current->prev->next = current->next; // Link previous node to next node
            current->next->prev = current->prev; // Link next node to previous node
        }

        delete current; // Free the memory
        size--; // Decrease the size of the list
    } 

    void display() const {
        if (head == nullptr) {
            std::cout << "List is empty" << std::endl;
            return; // Check if the list is empty
        }

        Node* current = head;
        while (current != nullptr) { // Traverse the list
            std::cout << current->data; // Print the data
            if (current->next != nullptr) {
                std::cout << " <-> "; // Print the separator
            }
            current = current->next; // Move to the next node
        }
        std::cout << std::endl; // Print a new line
    }
};

int main() { //The Code executes over here
    DoublyLinkedList list;

    // Operations will be added here based on visualization state

    std::cout << "Current list: ";
    list.display();

    return 0;
}`;

  // Generate operations based on current nodes, this lets us update code dynamically
  let operations = '';

  nodes.forEach((node, index) => {
    if (index === 0) {
      operations += `\n    list.insertAtBeginning("${node.data}");`;
    } else if (index === nodes.length - 1 && node.action === 'insertAtPosition') {
      // Ensure insertAtPosition is used if explicitly chosen for the last index
      operations += `\n    list.insertAtPosition("${node.data}", ${index});`;
    } else if (index === nodes.length - 1) {
      operations += `\n    list.insertAtEnd("${node.data}");`;
    } else {
      operations += `\n    list.insertAtPosition("${node.data}", ${index});`;
    }
  });

  // Insert operations into the code
  return baseCode.replace('// Operations will be added here based on visualization state', operations);
};