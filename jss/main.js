const ActivityType = document.querySelector("#selectActivity");
const Activity = document.querySelector("#Activity");
const Start = document.querySelector("#start-time");
const End = document.querySelector("#end-time");
const Add = document.querySelector("#AddActivity");
const HeadingEl = document.querySelector("#Heading");
const DomainTable = document.querySelector("#ActivityTable");
const ActivityTable = document.querySelector("#Activities");

let TotalTime = "00:00";
let ActivitiesArr = [];

HeadingEl.textContent = "Total :" + TotalTime;

function convert (hh, mm) {

	let rhh = "";
	if (hh < 10)
		rhh += "0";
	rhh += hh.toString();

	let rmm = "";
	if (mm < 10)
		rmm += "0";
	rmm += mm.toString();
	
	return rhh + ":" + rmm;
}

function sumTime (start, end) {

	let start_hh = parseInt(start[0] + start[1], 10);
	let start_mm = parseInt(start[3] + start[4], 10);
	let end_hh = parseInt(end[0] + end[1], 10);
	let end_mm = parseInt(end[3] + end[4], 10);
	let hh = start_hh + end_hh;
	let mm = start_mm + end_mm;

	if (mm > 59) {
		mm = mm - 60;
		hh = hh + 1;
	}

	return convert(hh, mm);
}

function diffTime (start, end) {
	
	let start_hh = parseInt(start[0] + start[1], 10);
	let start_mm = parseInt(start[3] + start[4], 10);
	let end_hh = parseInt(end[0] + end[1], 10);
	let end_mm = parseInt(end[3] + end[4], 10);
	let hh = end_hh - start_hh;
	let mm = end_mm - start_mm;

	if (end_mm < start_mm){
		mm = 60 + mm;
		hh = hh - 1;
	}

	return convert(hh, mm);
}


function generateDomainTable (Arr) {

	let sometext = ``;
	let counter = 1;
	Arr.map(event => {
		sometext = sometext +  `<tr>
					      			<th scope="row">${counter}</th>
							        <td>${event.DomainName}</td>
							        <td>${event.duration}</td>
								</tr>`;
		counter++;
	});
	DomainTable.innerHTML = sometext;
	return sometext;
}

function generateActivities (Arr) {

	let NewArr = [];
	let sometext = ``;
	Arr.map(newevent => {
		let oldDomain = NewArr.findIndex(ele => ele.DomainName === newevent.domain);
		if (oldDomain === -1) {
			let newDomain = {};
			newDomain.DomainName = newevent.domain;
			newDomain.duration = newevent.duration;
			NewArr.push(newDomain);
		}
		else {
			NewArr[oldDomain].duration = sumTime(newevent.duration, NewArr[oldDomain].duration);
		}

		sometext = sometext + `<li class="list-group-item d-flex justify-content-between">
									<div class="d-flex flex-column">
										${newevent.event}
									</div>
									<div>
										<span class="px-5">
											${newevent.start_time}
										</span>
										<span class="px-5">
											${newevent.end_time}
										</span>
										<button type="button" class="btn btn-outline-danger btn-sm"
										 onclick = "deleteActivity(${newevent.moment.valueOf()})">
											<i class="fas fa-trash-alt"></i>
										</button>
									</div>
								</li>`;
	});

	NewArr.sort(function (value1, value2) {
		if (value1.duration < value2.duration)
			return 1;
		return -1; 
	});
	generateDomainTable(NewArr);
	ActivityTable.innerHTML = sometext;
}

function addActivityToList () {

	if (End.value <= Start.value) {

		window.alert("Ending Time must be greater than starting time");
		return;
	}

	const ActivityItem = {};
	ActivityItem.domain = ActivityType.value;
	ActivityItem.event = Activity.value;
	ActivityItem.start_time = Start.value;
	ActivityItem.end_time = End.value;
	ActivityItem.duration = diffTime(ActivityItem.start_time, ActivityItem.end_time);
	ActivityItem.moment = new Date();

	if (ActivitiesArr.find(ele => {
		if (ele.start_time >= ActivityItem.start_time && ele.start_time < ActivityItem.end_time)
			return true;
		if (ele.start_time < ActivityItem.start_time && ele.end_time > ActivityItem.start_time)
			return true;
		return false;
	})) {

		window.alert("This time is overlapping other activity time");
		return;
	}

	TotalTime = sumTime(ActivityItem.duration, TotalTime);
	HeadingEl.textContent = "Total :" + TotalTime;
	ActivitiesArr.push(ActivityItem);
	ActivitiesArr.sort(function (start1, start2) {
		if (start1.start_time > start2.start_time)
			return 1;
		return -1;
	});

	generateActivities(ActivitiesArr);
}

function deleteActivity (moment) {

	let NewArr = [];

	ActivitiesArr.map(ele => {
		if (ele.moment.valueOf() !== moment) {
			NewArr.push(ele);
		}
		else {
			TotalTime = diffTime(ele.duration, TotalTime);
		}
		return 0;
	});

	HeadingEl.textContent = `Total :${TotalTime}`;
	ActivitiesArr = NewArr;
	generateActivities(NewArr);
}


Add.addEventListener('click', addActivityToList, false);