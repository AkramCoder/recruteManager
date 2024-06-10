
import React from 'react'
import { Modal, Button } from "react-bootstrap";
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';

const DeleteModal = ({ showModal, hideModal, confirmModal, id, message }) => {

    return (
        <Modal show={showModal} onHide={hideModal}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="alert alert-danger">{message}</div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={hideModal}>
                    Annuler
                </Button>
                <Button variant="danger" onClick={() => confirmModal(id)}>
                    Supprimer
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default DeleteModal;