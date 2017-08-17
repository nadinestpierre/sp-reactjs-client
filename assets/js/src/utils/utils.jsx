import Moment from 'moment';
import CamlBuilder from '../../vendor/camljs';
import { IMGPATH } from './settings';

export function GetAssetsPath(projectName) {
	return `${_spPageContextInfo.siteAbsoluteUrl}/Style%20Library/${projectName}/`;
}

export function GetImgPath(projectName) {
	return `${GetAssetsPath(projectName) + IMGPATH}`;
}

export function GetEqNeqOrAndFilter(fields, values, comp, cond) {
	let filterString = '';

	for (let i = 0; i < fields.length; i++) {
		for (let j = 0; j < values.length; j++) {
			const value = values[j] === 1 || values[j] === 0 ? values[j] : `'${values[j].indexOf(';#') !== -1 ? values[j].split(';#')[0] : values[j]}'`;
			filterString += (`${fields[i]} ${comp || 'eq'} ${value} ${cond || 'or'} `);
		}
	}

	return filterString.trim().replace(/ or$| and$/, '');
}

export function GetSubStringOfFilter(value, fields, cond) {
	let filterString = '';

	for (let i = 0; i < fields.length; i++) {
		const condition = cond || 'or';
		filterString += (`substringof('${value}', ${fields[i]}) ${condition} `);
	}

	return filterString.trim().replace(/ or$| and$/, '');
}

export function GetEqNeqOrAndFilterCaml(field, type, values) {
	const exps = [];

	for (let i = 0; i < values.length; i++) {
		let fieldExpression = '';

		switch (type) {
			case 'lookup':
				fieldExpression = CamlBuilder.Expression().LookupField(field).Value();
				break;
			case 'lookupmulti':
				fieldExpression = CamlBuilder.Expression().LookupMultiField(field).Value();
				break;
			default:
				fieldExpression = CamlBuilder.Expression().TextField(field);
				break;
		}

		const value = values[i] && values[i].indexOf(';#') !== -1 ? values[i].split(';#')[0] : values[i];

		exps.push(fieldExpression.EqualTo(value));
	}

	return exps;
}

export function MergeObjects(obj1, obj2) {
	const obj3 = {};

	if (obj1) {
		Object.keys(obj1).forEach((key) => {
			obj3[key] = obj1[key];
		});
	}

	if (obj2) {
		Object.keys(obj2).forEach((key) => {
			obj3[key] = obj2[key];
		});
	}

	return obj3;
}

export function JoinQuery(query1, query2, cond) {
	return (query1 && query2 ? `(${query1}) ${cond} (${query2})` : (query1 || query2));
}

export function CompareByTitle(a, b) {
	return (a.title < b.title ? -1 : (a.title > b.title ? 1 : 0));
}

export function CompareByCreated(a, b) {
	const newA = Moment(a.Created);
	const newB = Moment(b.Created);
	const diff = newA.diff(newB);
	return diff < 0 ? 1 : diff > 0 ? -1 : 0;
}

export function CreateMarkup(htmlString) {
	return {
		__html: htmlString
	};
}

export function RedirectToPage(pageUrl) {
	window.location.href = pageUrl;
}

export function ListUserProfileProperties(results) {
	for (let i = 0; i < results.length; i++) {
		console.log(`Key: ${results[i].Key} Value: ${results[i].Value}`);
	}
}

export function DetectIE() {
	const ua = window.navigator.userAgent;
	const msie = ua.indexOf('MSIE ');

	if (msie > 0) {
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}

	const trident = ua.indexOf('Trident/');

	if (trident > 0) {
		const rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}

	const edge = ua.indexOf('Edge/');

	if (edge > 0) {
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}

	return false;
}

export function GetFileNameFromUrl(url) {
	const splittedUrl = url.split('/');
	const splittedUrlLength = splittedUrl.length;
	return splittedUrlLength > 0 ? splittedUrl[splittedUrlLength - 1] : '';
}

export function IfArrayContainsObject(array, property, value) {
	const index = -1;

	if (value) {
		for (let i = 0; i < array.length; i++) {
			if (array[i][property] === value) {
				return i;
			}
		}
	}

	return index;
}

function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

export function GenerateGuid() {
	return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function EqualObjects(obj1, obj2, field) {
	return obj1 && obj2 ? JSON.stringify(obj1[field]) === JSON.stringify(obj2[field]) : (!obj1 && !obj2);
}

export function SelectSrcValue(imageString) {
	if (imageString) {
		const imgArray = imageString.split(' ');

		for (let i = 0; i < imgArray.length; i++) {
			if (imgArray[i].startsWith('src')) {
				const srcArray = imgArray[i].split('"');
				return srcArray.length > 0 ? srcArray[1] : '';    
			}
		} 
	}

	return '';
}

export function ArrayAdiff(a1, a2) {
	return a1.filter(x => a2.indexOf(x) < 0);
}

export function GetTermsFromTaxonomyStore(termSetId, onComplete) {
	const context = SP.ClientContext.get_current();
	const taxSession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
	const termStore = taxSession.getDefaultSiteCollectionTermStore();
	const termSet = termStore.getTermSet(termSetId);
	const terms = termSet.get_terms();

	context.load(terms);

	context.executeQueryAsync(() => {
		const termEnumerator = terms.getEnumerator();
		const values = [];

		while (termEnumerator.moveNext()) {
			const currentTerm = termEnumerator.get_current();

			values.push({
				Id: currentTerm.get_id()._m_guidString$p$0,
				Title: currentTerm.get_name()
			});
		}

		onComplete(values);
	},
	(sender, args) => {
		console.log(args.get_message());
	});
}

export function GetQueryString(variable, query) {
	const _query = query ? query.split('?')[1] : window.location.search.substring(1);
	const vars = _query.split('&');

	for (let i = 0; i < vars.length; i++) {
		const pair = vars[i].split('=');

		if (pair[0] === variable) {
			return unescape(pair[1]);
		}
	}
}

export function GetItemsCSOM(siteUrl, listName, camlQuery) {
	return new Promise((resolve, reject) => {
		const ctx = new SP.ClientContext(siteUrl);
		const list = ctx.get_web().get_lists().getByTitle(listName);
		let query = null;

		if (camlQuery) {
			query = new SP.CamlQuery();
			query.set_viewXml(camlQuery);
		} else {
			query = SP.CamlQuery.createAllItemsQuery();
		}

		const items = list.getItems(query);

		ctx.load(items);
		ctx.executeQueryAsync(() => {
			const result = items.get_data().map(i => i.get_fieldValues());
			resolve(result);
		}, (err) => {
			reject(err);
		});
	});
}

export function GetListItemPermissions(listName, itemId) {
	return $.ajax({  
		url: `${_spPageContextInfo.siteAbsoluteUrl}/_api/web/lists/getByTitle('${listName}')/getItemById(${itemId})/roleassignments(principalid=${_spPageContextInfo.userId})/RoleDefinitionBindings?$select=Name`,  
		type: 'POST',  
		headers: {  
			Accept: 'application/json;odata=verbose',  
			'content-Type': 'application/json;odata=verbose',  
			'X-RequestDigest': $('#__REQUESTDIGEST').val()  
		},  
		dataType: 'json'
	}); 
}

export function FormatBytes(bytes, decimals) {
	if (bytes === 0) {
		return '0 Byte';
	}

	const k = 1000;
	const dm = decimals + 1 || 3;
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
}