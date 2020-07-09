let page = 1; //начинается с первой стр//

async function getResponse() {  //функция вывоза данных для таблицы фильтрованно//
	let content = await filterContent()  
	content.sort( compare );
	
	let tbody = $('#cafe_list')
	tbody.empty();
	
	for (i = 0; i < 20*(page-1); i++) {
		content.shift()
	}
	
	for (i = 0; i < 20; i++) {
		var item = content[i];
		if(typeof(item) !== "undefined" && item !== null)
		tbody.append( '<tr class ="cafe_item">'+
		  '<th scope="row">'+item.name+'</th>'+
		  '<td>'+item.typeObject+'</td>'+
		  '<td>'+item.address+'</td>'+	
		   '<td><button class="btn  btn-sm btn-block bgbot" onclick="setMenuInfo('+item.id+'); setSum(); return false;">Выбрать</button></td>'+	
		  '</tr>')
	}
	setPaginator()
}

function NextPage()
{
	page++;
	getResponse();
}

function PreviousPage()
{
	if(page != 1) page--;
	getResponse();
}


function GetPage(user_page)
{
	page = user_page;
	getResponse();
}

function setPaginator()
{
	let paginator = $('#paginator')
	var page_number = (page == 1) ? page : page-1;
	paginator.empty();
	paginator.append('<li class="page-item ">'+
			  '<a class="page-link" href="#" tabindex="-1" onclick="PreviousPage(); return false;">Назад</a>'+
			'</li>'+
			'<li class="page-item '+ active(page, page_number) +'"><a class="page-link" href="#" onclick="GetPage('+(page_number)+'); return false;">'+(page_number)+'</a></li>'+
			'<li class="page-item '+ active(page, page_number+1) +'"><a class="page-link" href="#" onclick="GetPage('+(page_number+1)+'); return false;">'+(page_number+1)+'</a></li>'+
			'<li class="page-item '+ active(page, page_number+2) +'"><a class="page-link" href="#" onclick="GetPage('+(page_number+2)+'); return false;">'+(page_number+2)+'</a></li>'+
			'<li class="page-item">'+
			 '<a class="page-link" href="#" onclick="NextPage(); return false;">Вперед</a>'+
			'</li>');
}

function active(page, page_number)
{
	return (page == page_number)? "active" : ""
}

async function setMenuInfo(cafe_id)
{
	let menu = $('#menu')
	menu.empty();
	
	let response_cafe_item = await fetch('http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1/'+cafe_id+'?api_key=511e533c-90f7-4ab4-9f4e-e384b6846b57')
	let cafe_item = await response_cafe_item.json()
	
	$('body').append('<div id="cafe_info" data-address="'+cafe_item["address"]+'" data-name="'+cafe_item["name"]+'" data-rate="'+cafe_item["rate"]+'" data-admarea="'+cafe_item["admArea"]+'" data-district="'+cafe_item["district"]+'"></div>')
	
	
	let response_cafe_item_myjson = await fetch('http://webdev-exam-2020-1-niki.std-152.ist.mospolytech.ru/menu_items.json')
	let cafe_item_myjson = await response_cafe_item_myjson.json()
								  
	for (i = 1; i <= 10; i++) {
		menu.append('<div class="col-md-4">'+
          '<div class="card mb-4 shadow-sm">'+
            '<img src="'+cafe_item_myjson[i-1]["image"]+'" class="bd-placeholder-img card-img-top" width="100%"height="225"  alt="Responsive image">'+
		  '<div class="card-body">'+
			'<h5>'+cafe_item_myjson[i-1]["name"]+'</h5>'+
              '<p >Описание: '+cafe_item_myjson[i-1]["description"]+'</p>'+
			  '<h6>Цена: <span id="price_'+i+'" data-price="'+cafe_item["set_"+i]+'" data-image="'+cafe_item_myjson[i-1]["image"]+'" data-name="'+cafe_item_myjson[i-1]["name"]+'">'+cafe_item["set_"+i]+'</span> руб.</h6>'+
              '<div class="d-flex justify-content-between align-items-center">'+
               '<div class="btn-group">'+
				  '<input type="number" class="form-control" id="count_'+i+'" min="0" value=0 onchange="setSum()">'+
                '</div>'+
              '</div>'+
            '</div>'+
          '</div>'+
        '</div>')
	}
}

function setSum()
{
	let sum = 0;
	for (i = 1; i <= 10; i++) {
		sum+= ($('#price_'+i).data("price"))*$('#count_'+i).val()
	}
	if ($('#fastDelivery').is(":checked") && sum != 0)
	{
	  sum *= 1.2;
	}
	
	if(isNaN(sum)) sum=0;
	$('#sum').text(sum)
}

async function setFilter()
{
	let response = await fetch('http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1?api_key=511e533c-90f7-4ab4-9f4e-e384b6846b57')
	let content = await response.json()
	
	let admArea = $('#admArea')
	admArea.empty();
	admArea.append('<option value="">Выберите административный округ...</option>') 
	for(select_option in getUnique(content, "admArea")) 
	{
		admArea.append('<option value="'+select_option+'">'+select_option+'</option>')
	}
	
	let district = $('#district')
	district.empty();
	district.append('<option value="">Выберите район...</option>')
	for(select_option in getUnique(content, "district"))
	{
		district.append('<option value="'+select_option+'">'+select_option+'</option>')
	}
	
	let typeObject = $('#typeObject')
	typeObject.empty();
	typeObject.append('<option value="">Выберите тип...</option>')
	for(select_option in getUnique(content, "typeObject"))
	{
		typeObject.append('<option value="'+select_option+'">'+select_option+'</option>')
	}
}

async function getCafes()
{
	let response = await fetch('http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1?api_key=511e533c-90f7-4ab4-9f4e-e384b6846b57')
	let content = await response.json()
	return content
}

async function filterContent()
{
	let response = await fetch('http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1?api_key=511e533c-90f7-4ab4-9f4e-e384b6846b57')
	let content = await response.json()
	
	let admArea = $('#admArea').val()
	let district = $('#district').val()
	let typeObject = $('#typeObject').val()
	let socialPrivileges = $('#socialPrivileges').val()
	
	if(admArea != "" && typeof(admArea) !== "undefined" && admArea !== null) content = content.filter(item => item.admArea == admArea);

	if(district != "" && typeof(district) !== "undefined" && district !== null) content = content.filter(item => item.district == district);
	
	if(typeObject != "" && typeof(typeObject) !== "undefined" && typeObject !== null) content = content.filter(item => item.typeObject == typeObject);
	
	if(socialPrivileges != "" && typeof(socialPrivileges) !== "undefined" && socialPrivileges !== null) content = content.filter(item => item.socialPrivileges == socialPrivileges);
	
	return content;
}

function getUnique(content, field_name) 
{
	var unique = [];
	var distinct = [];
	for( let i = 0; i < content.length; i++ ){
	  if( !unique[content[i][field_name]]){
		distinct.push(content[i][field_name]);
		unique[content[i][field_name]] = 1;
	  }
	}
	return unique;
}

function compare( a, b ) { 
  if ( a.rate > b.rate ){
    return -1;
  }
  if ( a.rate < b.rate ){
    return 1;
  }
  return 0;
}

function setOrderCard()
{
	$("#orderCard").empty();
	($('#fastDelivery').is(":checked"))? $('#orderCardFastDelivery').text("Да") : $('#orderCardFastDelivery').text("Нет")
	
	$('#orderCardCafeName').text($("#cafe_info").data("name"));
	$('#orderCardAdmArea').text($("#cafe_info").data("admarea"));
	$('#orderCardDistrict').text($("#cafe_info").data("district"));
	$('#orderCardAddress').text($("#cafe_info").data("address"));
	$('#orderCardRate').text($("#cafe_info").data("rate"));
	
	let giftId = Math.floor(Math.random() * 10) + 1;
	
	let sum = 0;
	for (i = 1; i <= 10; i++) {
		if(!isNaN($('#price_'+i).data("price")))
		{
			sum+= ($('#price_'+i).data("price"))*$('#count_'+i).val()
			
			let count = $('#count_'+i).val();
		
			let giftCount = (i == giftId && $('#wantGift').is(":checked")) ? parseInt(count)+1 : count;
			if((($('#price_'+i).data("price"))*count) != 0)
			$("#orderCard").append('<div class="col-md-3 mb-3">'+
							'<img src="'+$('#price_'+i).data("image")+'" class="bd-placeholder-img card-img-top" width="100%"height="50"  alt="Responsive image">'+
						'</div>'+
						'<div class="col-md-3 mb-3">'+
							'<b>'+$('#price_'+i).data("name")+'</b>'+
						'</div>'+
						'<div class="col-md-3 mb-3">'+
							'<small class="text-muted">'+giftCount+'*'+$('#price_'+i).data("price")+'р</small>'+
						'</div>'+
						'<div class="col-md-3 mb-3">'+
							'<b class="logotext1">'+(($('#price_'+i).data("price"))*count)+' р</b>'+
						'</div>')
			else if(i == giftId && $('#wantGift').is(":checked"))
			{
				count = 1;
				$("#orderCard").append('<div class="col-md-3 mb-3">'+
							'<img src="'+$('#price_'+i).data("image")+'" class="bd-placeholder-img card-img-top" width="100%"height="50"  alt="Responsive image">'+
						'</div>'+
						'<div class="col-md-3 mb-3">'+
							'<b>'+$('#price_'+i).data("name")+'</b>'+
						'</div>'+
						'<div class="col-md-3 mb-3">'+
							'<small class="text-muted">'+count+'*'+$('#price_'+i).data("price")+'р</small>'+
						'</div>'+
						'<div class="col-md-3 mb-3">'+
							'<b class="logotext1">'+(($('#price_'+i).data("price"))*count)+' р</b>'+
						'</div>')
			}
		}
	}
	
	if ($('#fastDelivery').is(":checked") && sum != 0)
	{
	  sum *= 1.2;
	}
	
	if(isNaN(sum)) sum=0;
	$('#orderCardSum').text(sum.toFixed(2))
}

function showOrderSuccess()
{
	$('#orderSuccess').show()
}

getResponse().then(setFilter())