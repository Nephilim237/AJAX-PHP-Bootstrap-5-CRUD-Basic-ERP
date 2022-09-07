$(function() {
    $('table').DataTable();

    //créer une facture
    $('#create').on('click', function(e) {
        let formOrder = $('#formOrder')
        if (formOrder[0].checkValidity()) {
            e.preventDefault();
            $.ajax({
                url: 'process.php',
                type: 'post',
                data: formOrder.serialize() + '&action=create',
                success: function(response) {
                    $('#createModal').modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: 'Succès',
                    })
                    formOrder[0].reset();
                    getBills()
                }
            })
        }
    })

    //Récupère les fatures
    getBills();
    function getBills() {
        $.ajax({
            url: 'process.php',
            type: 'post',
            data: { action: 'fetch'},
            success: function (response) {
                $('#orderTable').html(response);
                $('table').DataTable({
                    order : [0, 'desc'],
                });
            }
        })
    }

    $('body').on('click', '.editBtn', function(e) {
        e.preventDefault();
        $.ajax({
            url: 'process.php',
            type: 'post',
            data: {workingId: this.dataset.id},
            success: function(response) {
                let billInfo = JSON.parse(response);
                $('#bill_id').val(billInfo.id)
                $('#customerUpdate').val(billInfo.customer);
                $('#cashierUpdate').val(billInfo.cashier);
                $('#amountUpdate').val(billInfo.amount);
                $('#receivedUpdate').val(billInfo.received);
                let select = document.querySelector('#stateUpdate');
                let stateOptions = Array.from(select.options);
                stateOptions.forEach((o, i) => {
                    if (o.value === billInfo.state) select.selectedIndex = i;
                })
            }
        })
    })

    //update une facture
    $('#update').on('click', function(e) {
        let formOrder = $('#formUpdateOrder')
        if (formOrder[0].checkValidity()) {
            e.preventDefault();
            $.ajax({
                url: 'process.php',
                type: 'post',
                data: formOrder.serialize() + '&action=update',
                success: function(response) {
                    $('#updateModal').modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: 'Succès',
                    })
                    formOrder[0].reset();
                    getBills()
                }
            })
        }
    })

    $('body').on('click', '.infoBtn', function (e) {
        e.preventDefault();
        $.ajax({
            url: 'process.php',
            type: 'post',
            data: {informationId: this.dataset.id},
            success: function(response) {
                let informations = JSON.parse(response);
                Swal.fire({
                    title: `<strong>Information de la facture N° ${informations.id} </strong>`,
                    icon: 'info',
                    html:
                        `Nom du client: <b>${informations.customer}</b> <br> 
                         Montant facture: <b>${informations.amount} $</b> <br>
                         Montant perçu: <b>${informations.receive} $</b> <br>
                         Montant rendu: <b>${informations.returned} $</b> <br>
                         Etat de la facture: <b>${informations.state}</b> <br>
                         etablie par: <b>${informations.cashier}</b> <br>  `,
                    showCloseButton: true,
                    focusConfirm: false,
                    confirmButtonText:
                        '<i class="fa fa-thumbs-up"></i> Super!',
                    confirmButtonAriaLabel: 'Thumbs up, great!'
                })
            }
        })
    })


    $('body').on('click', '.deleteBtn', function(e) {
        e.preventDefault();

        Swal.fire({
            title: 'Vous allez supprimer la facture?' + this.dataset.id,
            text: "Cette action est irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, j\'en suis sûr!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: 'process.php',
                    type: 'post',
                    data: { deletionId: this.dataset.id},
                    success: function(response) {
                        if (response == 1) {
                            Swal.fire(
                                'Suppression!',
                                'Opération réussie.',
                                'success'
                            )
                            getBills();
                        }
                    }
                })
            }
        })
    })
})