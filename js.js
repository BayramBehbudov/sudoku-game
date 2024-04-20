const board = document.getElementById("board")


for (let i = 0; i < 9; i++) {  // sətrlər üçün döngü yaradırıq
    for (let j = 0; j < 9; j++) { // sütunlar üçün döngü yaradırıq
        // müvafiq olaraq dəyişənə mənimsədirik
        const row = i;
        const col = j;

        //  sudokuda 3lü qruplar bildiyimiz kimi həmin qrupları isə abc.. olaraq fərqləndirəcəyik lakin inputları yaradarkən qruparı təyin etmək üçün aşağıdakı formada təyin edirik
        const group = getGroup(row, col);

        // id-si board olan divin içinə inputları, atributları ilə birlikdə göndəririk. 
        board.innerHTML += `<input maxlength="1" type="number" class="inputs" row="${row}" col="${col}" id="${row}${col}" group="${group}">`;
    }
}


function getGroup(row, col) { // yuxarıda qeyd etdiyim qrupları təyin edən funksiya. qeyd edimki doğru olması üçün inputun sətrinə və sütununa görə təyin olunur 
    const groupLetters = ["a", "b", "c", "d", "e", "f", "r", "t", "y"];

    const groupIndex = Math.floor(row / 3) * 3 + Math.floor(col / 3);

    return groupLetters[groupIndex];
}


const inputs = document.querySelectorAll(".inputs") // bir neçə yerdə istifadə edəcəyik. belə ki inputların hamısını bir dəyişənə yığırıq. onu da qeyd edim ki, array kimi görünsə də array deyil NodeList formasında qaytarır.


const wrongChar = ["e", "0", ",", ".", "+", "-"] // İnput type number olsa da bu elementləri də daxil etmək mümkün olur buna görə də bunları götürüb yoxlayacağıq

inputs.forEach(item => {  // inputa dəyər daxil edərkən yaranan event

    item.addEventListener("input", (e) => {

        if (wrongChar.includes(e.data)) { // burada yoxlayırıq ki istifadəçi yuxarıdakı səhv elementləri daxil edib yoxsa yox və müvafiq funksiyalar çağırılır

            redback(item)
            item.value = ""

        } else {

            controller(e)
        }

    })
})



function rndNumb() { // random rəqəm verir
    const rndNumb = Math.floor(Math.random() * 10)
    return rndNumb
}




function rndNumbWrite() { // bildiyimiz kimi oyuna başlamadan öncə bəzi rəqəmlər ipucu olaraq görünməlidi

    // ilkin olaraq 3 rəqəm alırıq. Sətr, sütun və inputa daxil ediləcək rəqəm üçün istifadə edəcəyik
    const rndNumber = rndNumb()
    const rndNumber1 = rndNumb()
    const rndNumber2 = rndNumb()


    if (rndNumber1 < 9 && rndNumber2 < 9 && rndNumber > 0) { // sətr və sütün 9 olmamalıdı çünkü indexlər 0-8 arası dəyişir. Əlavə edəcəyimiz rəqəm isə 0 olmamalıdı çünkü 1-9 arası olmalıdı

        const idForInput = "" + rndNumber1 + rndNumber2  // bizə id lazımdırki ora rəqəm əlavə edək

        if (checkEmptyBoxesForRndWrite(idForInput, rndNumber1, rndNumber2, rndNumber)) {  // lakin rəqəmi göndərməmiş o rəqəmin uyğunluğunu yoxlayırıq

            inputs.forEach(item => {  // həmin id tapılır və əgər boşdusa rəqəm əlavə edirik və onu readOnly əlavə edirik. readOnly dəyəri dəyişməyə icazə vermir lakin görüntüsü olduğu kimi qalır

                if (item.id == idForInput && item.value == "") {
                    item.value = rndNumber
                    item.readOnly = true;
                }
            })
        }

    } else { rndNumbWrite() }  // gələn rəqəmlər istədiyimiz kimi deyilsə yenidən çağırır
}


for (let i = 0; i < 30; i++) { // bir neçə inputu doldurmaq üçün for yaratmışam
    rndNumbWrite()
}



function controller(e) { // bu funksiya rəqəm daxil edildikdən sonra çağrılır və uyğunluğu yoxlayır. arqument olaraq rəqəmin daxil edildiyi inputu qəbul edir

    // sətri sütunu grupu id müvafiq olaraq mənimsədirik
    const eRow = e.target.attributes.row.value
    const eCol = e.target.attributes.col.value
    const eGroup = e.target.attributes.group.value
    const eId = e.target.attributes.id.value


    const allItems = document.querySelectorAll(`[row="${eRow}"], [col="${eCol}"], [group="${eGroup}"]`); // bu dəyişən isə həmin sətri sütünu və grupu tamamilə götürür və aşağıda döndürür


    allItems.forEach(item => {

        if (item.value == e.data && item.id != eId) { // əgər uyğunsuzluq varsa aşağıdakı işləri görür
            redback(item);
            redback(e.target);
            e.target.value = '';
        }

    });

}








function checkEmptyBoxesForRndWrite(id, row, col, number) {  // bu funksiya yoxlayırki random yazdığımız rəqəm həmin inputa görə təkrarlanır ya yox
    
    let group = findGroup(id) // əvvəlcə funksiya ilə onun grupun alırıq
    let value = true


    const allItems = document.querySelectorAll(`[row="${row}"], [col="${col}"], [group="${group}"]`); //sonra yazmaq istədiyimiz sətri sütunu və grupu bir dəyişənə yığırıq və aşağıda döndürürük

    allItems.forEach(item => {

        if (item.value == number) { // əgər o rəqəm döngüdəki hansısa elementin valuesinə bərabər olsa value dəyişəni dəyişirik və sonra return edirik
            value = false
        }
    })

    return value
}





function findGroup(id) {  // yuxarı da gördük niyə lazımdı bu funksiya
    let group
    inputs.forEach(item => {
        if (item.id == id) {
            group = item.attributes.group.value
        }
    })
    return group
}



function redback(item) {  // inputun arxa fonunu qırmızı edən funksiya

    item.classList.toggle("redback")

    setTimeout(() => {
        item.classList.toggle("redback")
    }, 700);
}