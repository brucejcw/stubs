$(document).ready(function () {
  let apiList = []

  $('#apiList').delegate('input', 'click', clickApi)

  $('#search').on('input', searchInput)

  $('#checkall').click(checkAll)

  start()

  // ======================= functions =======================
  function start () {
    $.ajax({
      url: '/stub/all',
      success: function ({ data }) {
        apiList = data
        renderList(data)
      },
      error: () => {
        alert(`load stubs error`)
      },
    })
  }

  function checkAll() {
    const enabled = $(this).is(':checked')
    $.ajax({
      url: '/stub/setAll',
      type: 'POST',
      data: {
        enabled,
      },
      success: function () {
        apiList = apiList.map((d) => ({ ...d, enabled }))
        renderList(apiList)
        toastSuccess()
      },
      error: () => {
        alert(`check all error`)
      },
    })
  }

  function clickApi() {
    const checked = $(this).is(':checked')
    const api = $(this).val()
    $.ajax({
      url: '/stub/setApi',
      type: 'post',
      data: {
        enabled: checked,
        api: api,
      },
      error: () => {
        alert(`api enabled error: ${api}`)
      },
      success: () => {
        updateApiData(api)
        toastSuccess()
      },
    })
  }

  function searchInput() {
    const search = $(this).val()
    const regex = new RegExp(search, 'i')
    const filterData = apiList.filter(({ api }) => {
      return regex.test(api)
    })
    renderList(filterData)
  }

  function renderList(data) {
    $('#apiList').html(
      data.map((item) => {
        return $('<li/>').html(
            `
              <label>
                <input 
                    type="checkbox"
                    value="${item.api}" 
                    ${(item.enabled ? ' checked="checked"' : '')}
                >
                ${item.api}
              </label>
            `
        )
      }),
    )

    renderCheckAll(data)
  }

  function renderCheckAll(data) {
    const allChecked = data.every(d => d.enabled)
    if (allChecked) {
      $('#checkall').prop("checked", true)
    } else {
      $('#checkall').prop("checked", false)
    }
  }

  function updateApiData(api) {
    for (let i = 0; i < apiList.length; i++) {
      if (apiList[i].api === api) {
        apiList[i].enabled = !apiList[i].enabled
        break
      }
    }
    renderCheckAll(apiList)
  }

  function toastSuccess() {
    const $span = $('<div />').html('success')
    $('#notice').append($span)
    $span.fadeIn()
    setTimeout(() => {
      $span.fadeOut()
    }, 2000)
  }
})
