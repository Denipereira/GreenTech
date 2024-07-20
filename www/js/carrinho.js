var carrinho; // Declare carrinho fora do escopo do if para ser acessível globalmente

var localCarrinho = localStorage.getItem('carrinho');

if (localCarrinho) {
    carrinho = JSON.parse(localCarrinho);
    if (carrinho.length > 0) {
        // TEM ITEMS NO CARRINHO
        // RENDERIZAR O CARRINHO
        renderizarCarrinho();
        // SOMAR TOTAIS DOS PRODUTOS 
        calcularTotal();
    } else {
        // MOSTRAR CARRINHO VAZIO
        carrinhoVazio();
    }
} else {
    // MOSTRAR CARRINHO VAZIO
    carrinhoVazio();
}

function renderizarCarrinho() {
    // ESVAZIAR A ÁREA DOS ITENS
    $("#listaCarrinho").empty();

    // PERCORRER O NOSSO CARRINHO E ALIMENTAR A ÁREA
    $.each(carrinho, function (index, itemCarrinho) {
        var itemDiv = `
            <!-- item do carrinho -->
            <div class="item-carrinho">
              <div class="area-img">
                <img src="${itemCarrinho.item.imagem}">
              </div>
              <div class="area-details">
                <div class="sup">
                  <span class="name-prod">${itemCarrinho.item.nome}</span>
                  <a data-index="${index}" class="delete-item" href="#">
                    <i class="mdi mdi-close"></i>
                  </a>
                </div>
                <div class="middle">
                  <span>${itemCarrinho.item.principal_caracteristica}</span>
                </div>
                <div class="preco-quantidade">
                  <span>${itemCarrinho.item.preco_promocional.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <div class="count">
                    <a class="menos" data-index="${index}" href="#">-</a>
                    <input readonly class="qtd-item" type="text" value="${itemCarrinho.quantidade}">
                    <a class="mais" data-index="${index}" href="#">+</a>
                  </div>
                </div>
              </div>
            </div>
        `;

        $("#listaCarrinho").append(itemDiv);
    });

    $(".delete-item").on('click', function () {
        var index = $(this).data('index');
        console.log('O indice é: ', index);

        // COMFIRMAR
        app.dialog.confirm('Tem certeza que quer remover esse Item?', 'Remover', function () {

            // REMOVER O ITEM DO CARRINHO
            carrinho.splice(index, 1);
            // ATUALIZAR CARRINHO COM ITEM REMOVIDO
            localStorage.setItem('carrinho', JSON.stringify(carrinho))
            // ATUALIZAR PÁGINA
            app.views.main.router.refreshPage();
        });
    });

    $(".menos").on('click', function () {
        var index = $(this).data('index');
        console.log('O indice é: ', index);

        // SE TEM MAIS DE UM ITEM NA QUANTIDADE
        if (carrinho[index].quantidade > 1) {
            carrinho[index].quantidade--;
            carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho()
                calcularTotal()
        } else {
            var itemname = carrinho[index].item.nome;
            app.dialog.confirm(`gostaria de remover <strong>${itemname}</strong>?`, 'REMOVER', function () {
                carrinho.splice(index, 1);
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho()
                calcularTotal()
            });
        }

    });

    $(".mais").on('click', function () {
        var index = $(this).data('index');
        console.log('O indice é: ', index);

        carrinho[index].quantidade++;
        carrinho[index].total_item = carrinho[index].total_item = carrinho[index].quantidade * carrinho[index].item.preco_promocional;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderizarCarrinho()
        calcularTotal()

    });

}
function calcularTotal() {
    var totalCarrinho = 0;
    $.each(carrinho, function (index, itemCarrinho) {
        totalCarrinho += itemCarrinho.total_item;
    });
    // MOSTRAR O TOTAL
    $("#subtotal").html(totalCarrinho.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
}

function carrinhoVazio() {
    console.log('Carrinho está vazio');
    // ESVAZIAR LISTA DO CARRINHO
    $("#listaCarrinho").empty();

    // SUMIR OS ITEMS DE BAIX BOTÃO E TOTAIS
    $('#toolbarTotais').addClass('display-none');
    $('#toolbarCheckout').addClass('display-none');

    // MOSTRA SACOLA VAZIA
    $('#listaCarrinho').html(`
        <div class="text-align-center">
          <img width="300" src="img/empty.gif">
          <br><span class="color-gray">Nada Por Enquanto</span><br>
        </div>
    `);
}

$(document).ready(function () {
    $("#esvaziar").on('click', function () {
        app.dialog.confirm('Tem certeza que quer esvaziar o carrinho?', '<strong>ESVAZIAR</strong>', function () {
            // APAGAR O LOCALSTORAGE DO CARRINHO
            localStorage.removeItem('carrinho');
            app.views.main.router.refreshPage();
        });
    });
});

