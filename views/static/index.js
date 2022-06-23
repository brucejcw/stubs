$(document).ready(function () {
  let apiList = []

  // checkbox to enable, '/stub/enable',
  $('#apiList').delegate('input', 'click', function (e) {
    const checked = $(this).is(':checked')
    const api = $(this).val()
    $.ajax({
      url: '/stub/setApi',
      type: 'post',
      data: {
        enable: checked,
        api: api,
      },
      error: () => {
        alert(`api enable error: ${api}`)
      },
      success: () => {
        updateApiData(api)
        const $span = $('<div />').html('success')
        $('#notice').append($span)
        $span.fadeIn()
        setTimeout(() => {
          $span.fadeOut()
        }, 2000)
      },
    })
  })
  $('#search').on('input', function () {
    const search = $(this).val()
    const filterData = apiList.filter(({ api }) => {
      return api.includes(search)
    })
    renderList(filterData)
  })
  $('#checkall').click(function () {
    const enable = $(this).is(':checked')
    $.ajax({
      url: '/stub/setAll',
      type: 'POST',
      data: {
        enable,
      },
      success: function () {
        apiList = apiList.map((d) => ({ ...d, enable }))
        renderList(apiList)
      },
    })
  })
  $.ajax({
    url: '/stub/all',
    success: function ({ data }) {
      apiList = data
      renderList(data)
    },
  })
  function renderList(data) {
    $('#apiList').html(
      data.map((item) => {
        return $('<li/>').html(
          '<label>' +
            '<input type="checkbox"' +
            (item.enable ? 'checked="checked"' : '') +
            'value="' +
            item.api +
            '"' +
            '/>' +
            item.api +
            '</label>',
        )
      }),
    )
  }
  function updateApiData(api) {
    for (let i = 0; i < apiList.length; i++) {
      if (apiList[i].api === api) {
        apiList[i].enable = !apiList[i].enable
        break
      }
    }
  }
})
