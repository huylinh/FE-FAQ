$(document).ready(function () {
  loadTitle();
  // loadFaq();
  initEvents();
});

//Global variable
var getTitles = "https://be-faq-production.up.railway.app/api/v1/titles";
var offset = 0;
var limit = 5;
//su dung để phân trang
var pageNumber = 1;
var totalPages;
var paginationSize = 8;
var filterWord;

// selected title id
var selectedTitleId;
var titleEdit;
// seleted faq id
var selectedFaqId;
var selectedFaqEntity;

//update or delete option 1 la co 2 la khong
var isEdit = 0;

function initEvents() {
  //title
  $("#button_addTitle").click(function () {
    $("#title-name").val(``);
    $("#titleForm").show();
  });

  $("#title-cancel").click(function () {
    $("#titleForm").hide();
  });

  $("#title-save").click(function () {
    let title = {};
    title["name"] = $("#title-name").val();
    $.ajax({
      type: "POST",
      url: "https://be-faq-production.up.railway.app/api/v1/titles/",
      data: JSON.stringify(title),
      dataType: "json",
      contentType: "application/json",
      success: function (response) {
        alert("Add successfully!");
        loadTitle();
        $(".form").hide();
      },
    });
  });

  /**
   * Tìm kiếm câu hỏi
   */

  $(".search input").keyup(function () {
    filterWord = $(this).val();
    console.log(filterWord);
    pageNumber = 1;
    setTimeout(function () {
      loadFaq();
    }, 2000);
  });
  //chọn số bản ghi trên một trang
  $(".table__paging--right select").change(function () {
    limit = $(this).val();
    pageNumber = 1; //Chuyển lại về trang đầu tiên
    loadFaq();
  });

  /**
   * DOM cho pagination
   */

  $(document).on("click", ".paging__number", function () {
    pageNumber = Number($(this).text());
    // offset = 0;
    loadFaq();
  });
  $(".paging__button--next").click(function () {
    pageNumber++;
    // offset = 0;
    loadFaq();
  });
  $(".paging__button--pre").click(function () {
    pageNumber--;
    // offset = 0;
    loadFaq();
  });
  $(".paging__button--first").click(function () {
    pageNumber = 1;
    // offset = 0;
    loadFaq();
  });
  $(".paging__button--last").click(function () {
    pageNumber = totalPages;
    // offset = 0;
    loadFaq();
  });

  /**
   * DOM cho form faq
   */
  $(".button__icon--add").click(function () {
    $("#form__question").val("");
    $("#form__answer").val("");
    $(".form__header").text("");
    const titltSelected = $(".selected").data("entity").name;
    $(".form__header").text(`Thêm câu hỏi [${titltSelected}]`);
    $("#faqForm").show();
    isEdit = 0;
  });

  $("#faq-cancel").click(function () {
    $(".form").hide();
  });

  //Lưu câu hỏi
  $("#faq-save").click(function () {
    let faq = {};
    faq["title_id"] = $(".selected").data("id");
    faq["question"] = $("#form__question").val();
    faq["answer"] = $("#form__answer").val();
    if (isEdit) {
      $.ajax({
        type: "PUT",
        url:
          "https://be-faq-production.up.railway.app/api/v1/faqs/" +
          selectedFaqId,
        data: JSON.stringify(faq),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
          alert("Edited successfully!");
          loadFaq();
          $(".form").hide();
        },
      });
    } else {
      $.ajax({
        type: "POST",
        url: "https://be-faq-production.up.railway.app/api/v1/faqs",
        data: JSON.stringify(faq),
        dataType: "json",
        contentType: "application/json",
        success: function (response) {
          alert("New data has been added successfully!");
          loadFaq();
          $(".form").hide();
        },
      });
    }
  });

  //sửa câu hỏi
  $(".button__icon--edit").click(function () {
    if (selectedFaqId) {
      $("#form__question").val("");
      $("#form__answer").val("");
      $(".form__header").text("");
      const titltSelected = $(".selected").data("entity").name;
      $(".form__header").text(`Sửa câu hỏi [${titltSelected}]`);
      $("#form__question").val(`${selectedFaqEntity.question}`);
      $("#form__answer").val(`${selectedFaqEntity.answer}`);
      $("#faqForm").show();
      isEdit = 1;
    } else alert("Chọn câu hỏi cần sửa");
  });

  $(".button__icon--delete").click(function () {
    if (selectedFaqId) {
      $.ajax({
        type: "DELETE",
        url:
          "https://be-faq-production.up.railway.app/api/v1/faqs/" +
          selectedFaqId,
        success: function (response) {
          alert("Delete record successfully");
          // Load lại dữ liệu:
          loadFaq();
        },
      });
    } else alert("Chọn câu hỏi cần xóa");
  });

  // title dom
  //event cho form -> init event
  $("#edit-title-cancel").click(function () {
    $("#editForm").hide();
  });

  $("#edit-title-save").click(function () {
    let title = {};
    title.name = $("#editForm input").val();
    $.ajax({
      type: "PUT",
      url:
        "https://be-faq-production.up.railway.app/api/v1/titles/" +
        titleEdit.id,
      data: JSON.stringify(title),
      dataType: "json",
      contentType: "application/json",
      success: function (response) {
        alert("Edited title successfully!");
        loadTitle();
        $(".form").hide();
      },
    });
  });

  $("#edit-title-delete").click(function () {
    $.ajax({
      type: "DELETE",
      url:
        "https://be-faq-production.up.railway.app/api/v1/titles/" +
        selectedTitleId,
      success: function (response) {
        alert("Delete record title successfully");
        // Load lại dữ liệu:
        loadTitle();
        loadFaq();
        $(".form").hide();
      },
    });
  });
}
function titleEvent() {
  $(".faq-title").click(function () {
    $(this).siblings().removeClass("selected");
    this.classList.add("selected");
    selectedTitleId = $(".selected").data("id");
    offset = 0;
    loadFaq();
  });

  // $(".faq-title").dblclick(function () {
  //   $("#editForm input").val(``);
  //   titleEdit = $(this).data("entity");
  //   $("#editForm input").val(`${titleEdit.name}`);
  //   $("#editForm").show();
  // });
}

function faqEvent() {
  // Thiết lập smooth faq
  $(".faq__question").click(function () {
    $(this).children("svg").eq(0).toggleClass("rotate");
    $(this).siblings().slideToggle();
  });

  //   xóa câu hỏi
  // $(".faq").dblclick(function () {
  //   $(this).siblings().children().removeClass("faq-selected");
  //   $(this).children().toggleClass("faq-selected");
  //   // this.classList.add("faq-selected");
  //   selectedFaqId = $(this).data("id");
  //   selectedFaqEntity = $(this).data("entity");
  // });
}

function loadTitle() {
  selectedTitleId = null;
  $(".faq-title-list").empty();
  $.ajax({
    url: getTitles,
    method: "GET",
    async: false,
    success: function (titles) {
      let titleTag = "<div></div>";
      for (const title of titles.title) {
        // console.log(title.id);
        if (!selectedTitleId) {
          selectedTitleId = title.id;
          titleTag = `<div class="faq-title selected">${title.name}</div>`;
        } else {
          titleTag = `<div class="faq-title">${title.name}</div>`;
        }
        titleTag = $(titleTag).data("id", title.id);
        titleTag = $(titleTag).data("entity", title);
        // console.log($(titleTag).data());
        // console.log(jQuery.data(titleTag, "id"));
        // console.log($(titleTag).data("id"));
        $(".faq-title-list").append(titleTag);
      }
      titleEvent();
      loadFaq();
    },
    error: function (e) {
      console.log(e);
    },
  });
}

/**
 * Load faq question
 */
function loadFaq() {
  $(".faq-list").empty();
  console.log(selectedTitleId);
  $.ajax({
    url: `https://be-faq-production.up.railway.app/api/v1/filterWithId?offset=${
      (pageNumber - 1) * limit || ""
    }&limit=${limit || ""}&search=${
      filterWord || ""
    }&title_id=${selectedTitleId}`,
    method: "GET",
    async: false,
    success: function (res) {
      let faqTag;
      let sort = (pageNumber - 1) * limit + 1;
      //   console.log(res);
      for (const q of res.faqs) {
        faqTag = `<div class="faq">
          <div class="faq__question">
            <div class="question__content">
             ${sort}. 
             ${q.question}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-chevron-right question__icon"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
          <div class="faq__answer">
                ${q.answer}
          </div>`;
        faqTag = $(faqTag).data("id", q.id);
        faqTag = $(faqTag).data("entity", q);
        $(".faq-list").append(faqTag);
        sort++;
      }

      //Hiển tông số câu hỏi ở trong trang
      //   console.log(res.total);
      totalPages = Math.ceil(res.total / limit);
      drawPagination();
      if (res.total < limit || pageNumber == totalPages) {
        $("#numberOfPage").text(
          `${limit * (pageNumber - 1) + 1} - ${res.total}/${res.total}`
        );
      } else {
        // console.log("ok");
        $("#numberOfPage").text(
          `${limit * (pageNumber - 1) + 1} - ${limit * pageNumber}/${res.total}`
        );
      }
      //   $(".pagination__left").append(`<b>${}/${}</b> câu hỏi`);
    },
    error: function (e) {
      console.log(e);
    },
  });
  faqEvent();
}

/**
 * Vẽ lại pagination môi khi load dữ liệu lại từ đầu
 * Author: nhlinh
 * params totalPages Tổng số trang, pageNumber trang hiện tại, paginationSize là chốt để chuyển trang
 */

function drawPagination() {
  //clear
  $(".paging__numbers").empty();

  //Tạo một mảng lưu số trang
  function range(start, end) {
    return Array.from(Array(end - start + 1), (_, i) => i + start);
  }

  $(".paging__button--pre").toggleClass("disable", pageNumber == 1);
  $(".paging__button--next").toggleClass("disable", pageNumber == totalPages);
  //Tạo mảng trang có kiểu như sau 1 2  ...  13 14 15(C) 16 17 .. 28 29, 1 2 ... 10 , 1 .. 9 10
  //----------------------------sideWidth ... leftWidth/rightWidth .. sideWidth
  const sideWidth = paginationSize < 9 ? 1 : 3;
  const leftWidth = Math.trunc((paginationSize - sideWidth * 2 - 3) / 2);
  const rightWidth = Math.trunc((paginationSize - sideWidth * 2 - 3) / 2); // tru 3 là 2  dấu ba chấm, trang đang được chọn
  let arrayPageList;
  //Tổng số trang nhỏ hơn số nút bấm trên trang thi mảng bằng số trang luôn
  if (totalPages <= paginationSize) {
    arrayPageList = range(1, totalPages);
  }
  //không được vượt qua số trang đã cố định ở bên phải
  else if (pageNumber <= paginationSize - sideWidth - 1 - rightWidth) {
    arrayPageList = range(1, paginationSize - sideWidth - 1).concat(
      0,
      range(totalPages - sideWidth + 1, totalPages)
    );
  } else if (pageNumber > totalPages - sideWidth - 1 - rightWidth) {
    arrayPageList = range(1, sideWidth).concat(
      0,
      range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
    );
  } else {
    debugger;
    arrayPageList = range(1, sideWidth).concat(
      0,
      range(pageNumber - leftWidth, pageNumber + rightWidth),
      0,
      range(totalPages - sideWidth + 1, totalPages)
    );
  }

  arrayPageList.forEach((number) => {
    let btnNumber = $("<button></button>")
      .addClass("paging__number")
      .text(`${number || "..."}`);
    if (number == pageNumber) btnNumber.addClass("paging__number--selected");
    $(".paging__numbers").append(btnNumber);
  });
}
