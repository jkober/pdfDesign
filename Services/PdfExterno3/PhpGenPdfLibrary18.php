<?php
namespace Design\DesignBundle\Services\PdfExterno3;
use Design\DesignBundle\Services\PdfExterno3\fpdf18\FPDF;

class PhpGenPdfLibrary18 extends FPDF
{
    
    use PdfTags;
    use PdfQrTrait;
    use pdfAttach;
    use PdfSignUbica;
    var $angle = 0;

    function Rotate($angle, $x = -1, $y = -1) {
        if ($x == -1)
            $x = $this->x;
        if ($y == -1)
            $y = $this->y;
        if ($this->angle != 0)
            $this->_out('Q');
        $this->angle = $angle;
        if ($angle != 0) {
            $angle *= M_PI / 180;
            $c = cos($angle);
            $s = sin($angle);
            $cx = $x * $this->k;
            $cy = ($this->h - $y) * $this->k;
            $this->_out(sprintf('q %.5F %.5F %.5F %.5F %.2F %.2F cm 1 0 0 1 %.2F %.2F cm', $c, $s, -$s, $c, $cx, $cy, -$cx, -$cy));
        }
    }

    public function StartTransform() {

    }

    public function StopTransform() {
        $this->Rotate(0);
    }

    //----------------------------------------------------------------
    protected function checkPageBreak($h, $y) {

        if ($h + $y >= $this->PageBreakTrigger && !$this->InHeader && !$this->InFooter && $this->AcceptPageBreak()) {
            return true;
            //------------------------------------------------------------------
        } else {
            return false;
        }
    }

    public function getMargins() {
        $ret = array(
            'left' => $this->lMargin,
            'right' => $this->rMargin,
            'top' => $this->tMargin,
            'bottom' => $this->bMargin
        );
        return $ret;
    }



    public function getPage() {
        $page = $this->page;
        if (is_null($page)) {
            return 1;
        }
        return $page;
    }

    public function getInHeader() {
        return $this->InHeader;
    }

    public function getInFooter() {
        return $this->InFooter;
    }

    public function setPage($page, $resetmargins = false) {
        $cc = $this->page;
        $this->page = $page;
    }

    //----------------------------------------------------------------
    //----------------------------------------------------------------
    //----------------------------------------------------------------
    public function Cell($w, $h = 0, $txt = '', $border = 0, $ln = 0, $align = '', $fill = false, $link = '') {
            parent::Cell($w, $h, utf8_decode($txt), $border, $ln, $align, $fill, $link);
    }
    function Open()
    {
        // Begin document
        $this->state = 1;
    }
    function Output($dest='', $name='', $isUTF8=false)
    {
        return parent::Output($name,$dest,$isUTF8);
    }

    public function AddPage($orientation = '', $size = '',$rotation=0) {
        // Start a new page
        if ($this->state == 0)
            $this->Open();
        $family = $this->FontFamily;
        $style = $this->FontStyle . ($this->underline ? 'U' : '');
        $fontsize = $this->FontSizePt;
        $lw = $this->LineWidth;
        $dc = $this->DrawColor;
        $fc = $this->FillColor;
        $tc = $this->TextColor;
        $cf = $this->ColorFlag;

        $pg = $this->page + 1;
        $adp = true;
        if (isset($this->pages[$pg])) {
            $adp = false;
        }
        if ($adp) {
            if ($this->page > 0) {
                // Page footer
                $this->InFooter = true;
                $this->Footer();
                $this->InFooter = false;
                // Close page
                $this->_endpage();
            }
        }
        // Start new page
        $this->_beginpage($orientation, $size,$rotation);
        // Set line cap style to square
        $this->_out('2 J');
        // Set line width
        $this->LineWidth = $lw;
        $this->_out(sprintf('%.2F w', $lw * $this->k));
        // Set font
        if ($family)
            $this->SetFont($family, $style, $fontsize);
        // Set colors
        $this->DrawColor = $dc;
        if ($dc != '0 G')
            $this->_out($dc);
        $this->FillColor = $fc;
        if ($fc != '0 g')
            $this->_out($fc);
        $this->TextColor = $tc;
        $this->ColorFlag = $cf;
        // Page header
        if ($adp) {
            $this->InHeader = true;
            $this->Header();
            $this->InHeader = false;
        }
        // Restore line width
        if ($this->LineWidth != $lw) {
            $this->LineWidth = $lw;
            $this->_out(sprintf('%.2F w', $lw * $this->k));
        }
        // Restore font
        if ($family)
            $this->SetFont($family, $style, $fontsize);
        // Restore colors
        if ($this->DrawColor != $dc) {
            $this->DrawColor = $dc;
            $this->_out($dc);
        }
        if ($this->FillColor != $fc) {
            $this->FillColor = $fc;
            $this->_out($fc);
        }
        $this->TextColor = $tc;
        $this->ColorFlag = $cf;
    }

    function _beginpage($orientation, $size,$rotation=0) {
        $this->page++;
        if (!isset($this->pages[$this->page])) // solves the problem of overwriting a page if it already exists
            $this->pages[$this->page] = '';
        if ( is_array($this->PageLinks)){
            if ( array_key_exists($this->page,$this->PageLinks)==false) {
                $this->PageLinks[$this->page] = array();
            }
        }else{
            $this->PageLinks= array();
            $this->PageLinks[$this->page] = array();
        }

        //$this->pages[$this->page] = '';
        $this->state = 2;
        $this->x = $this->lMargin;
        $this->y = $this->tMargin;
        $this->FontFamily = '';
        // Check page size and orientation
        if ($orientation == '')
            $orientation = $this->DefOrientation;
        else
            $orientation = strtoupper($orientation[0]);
        if ($size == '')
            $size = $this->DefPageSize;
        else
            $size = $this->_getpagesize($size);
        if ($orientation != $this->CurOrientation || $size[0] != $this->CurPageSize[0] || $size[1] != $this->CurPageSize[1]) {
            // New size or orientation
            if ($orientation == 'P') {
                $this->w = $size[0];
                $this->h = $size[1];
            } else {
                $this->w = $size[1];
                $this->h = $size[0];
            }
            $this->wPt = $this->w * $this->k;
            $this->hPt = $this->h * $this->k;
            $this->PageBreakTrigger = $this->h - $this->bMargin;
            $this->CurOrientation = $orientation;
            $this->CurPageSize = $size;
        }
        if ($orientation != $this->DefOrientation || $size[0] != $this->DefPageSize[0] || $size[1] != $this->DefPageSize[1])
            $this->PageSizes[$this->page] = array($this->wPt, $this->hPt);
    }

    /* --  Code 39 empi -- */

    function Code39($x, $y, $code, $ext = true, $cks = false, $w = 0.4, $h = 8, $wide = true) {

        //Display code
        $this->SetFont('Arial', '', 10);
        //$this->Text($x, $y+$h+4, $code);

        if ($ext) {
            //Extended encoding
            $code = $this->encode_code39_ext($code);
        } else {
            //Convert to upper case
            $code = strtoupper($code);
            //Check validity
            if (!preg_match('|^[0-9A-Z. $/+%-]*$|', $code))
                $this->Error('Invalid barcode value: ' . $code);
        }

        //Compute checksum
        if ($cks)
            $code .= $this->checksum_code39($code);

        //Add start and stop characters
        $code = '*' . $code . '*';

        //Conversion tables
        $narrow_encoding = array(
            '0' => '101001101101', '1' => '110100101011', '2' => '101100101011',
            '3' => '110110010101', '4' => '101001101011', '5' => '110100110101',
            '6' => '101100110101', '7' => '101001011011', '8' => '110100101101',
            '9' => '101100101101', 'A' => '110101001011', 'B' => '101101001011',
            'C' => '110110100101', 'D' => '101011001011', 'E' => '110101100101',
            'F' => '101101100101', 'G' => '101010011011', 'H' => '110101001101',
            'I' => '101101001101', 'J' => '101011001101', 'K' => '110101010011',
            'L' => '101101010011', 'M' => '110110101001', 'N' => '101011010011',
            'O' => '110101101001', 'P' => '101101101001', 'Q' => '101010110011',
            'R' => '110101011001', 'S' => '101101011001', 'T' => '101011011001',
            'U' => '110010101011', 'V' => '100110101011', 'W' => '110011010101',
            'X' => '100101101011', 'Y' => '110010110101', 'Z' => '100110110101',
            '-' => '100101011011', '.' => '110010101101', ' ' => '100110101101',
            '*' => '100101101101', '$' => '100100100101', '/' => '100100101001',
            '+' => '100101001001', '%' => '101001001001');

        $wide_encoding = array(
            '0' => '101000111011101', '1' => '111010001010111', '2' => '101110001010111',
            '3' => '111011100010101', '4' => '101000111010111', '5' => '111010001110101',
            '6' => '101110001110101', '7' => '101000101110111', '8' => '111010001011101',
            '9' => '101110001011101', 'A' => '111010100010111', 'B' => '101110100010111',
            'C' => '111011101000101', 'D' => '101011100010111', 'E' => '111010111000101',
            'F' => '101110111000101', 'G' => '101010001110111', 'H' => '111010100011101',
            'I' => '101110100011101', 'J' => '101011100011101', 'K' => '111010101000111',
            'L' => '101110101000111', 'M' => '111011101010001', 'N' => '101011101000111',
            'O' => '111010111010001', 'P' => '101110111010001', 'Q' => '101010111000111',
            'R' => '111010101110001', 'S' => '101110101110001', 'T' => '101011101110001',
            'U' => '111000101010111', 'V' => '100011101010111', 'W' => '111000111010101',
            'X' => '100010111010111', 'Y' => '111000101110101', 'Z' => '100011101110101',
            '-' => '100010101110111', '.' => '111000101011101', ' ' => '100011101011101',
            '*' => '100010111011101', '$' => '100010001000101', '/' => '100010001010001',
            '+' => '100010100010001', '%' => '101000100010001');

        $encoding = $wide ? $wide_encoding : $narrow_encoding;

        //Inter-character spacing
        $gap = ($w > 0.29) ? '00' : '0';

        //Convert to bars
        $encode = '';
        for ($i = 0; $i < strlen($code); $i++)
            $encode .= $encoding[$code[$i]] . $gap;

        //Draw bars
        return $this->draw_code39($encode, $x, $y, $w, $h);
    }

    function checksum_code39($code) {

        //Compute the modulo 43 checksum

        $chars = array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K',
            'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
            'W', 'X', 'Y', 'Z', '-', '.', ' ', '$', '/', '+', '%');
        $sum = 0;
        for ($i = 0; $i < strlen($code); $i++) {
            $a = array_keys($chars, $code[$i]);
            $sum += $a[0];
        }
        $r = $sum % 43;
        return $chars[$r];
    }

    function encode_code39_ext($code) {

        //Encode characters in extended mode

        $encode = array(
            chr(0) => '%U', chr(1) => '$A', chr(2) => '$B', chr(3) => '$C',
            chr(4) => '$D', chr(5) => '$E', chr(6) => '$F', chr(7) => '$G',
            chr(8) => '$H', chr(9) => '$I', chr(10) => '$J', chr(11) => 'Â£K',
            chr(12) => '$L', chr(13) => '$M', chr(14) => '$N', chr(15) => '$O',
            chr(16) => '$P', chr(17) => '$Q', chr(18) => '$R', chr(19) => '$S',
            chr(20) => '$T', chr(21) => '$U', chr(22) => '$V', chr(23) => '$W',
            chr(24) => '$X', chr(25) => '$Y', chr(26) => '$Z', chr(27) => '%A',
            chr(28) => '%B', chr(29) => '%C', chr(30) => '%D', chr(31) => '%E',
            chr(32) => ' ', chr(33) => '/A', chr(34) => '/B', chr(35) => '/C',
            chr(36) => '/D', chr(37) => '/E', chr(38) => '/F', chr(39) => '/G',
            chr(40) => '/H', chr(41) => '/I', chr(42) => '/J', chr(43) => '/K',
            chr(44) => '/L', chr(45) => '-', chr(46) => '.', chr(47) => '/O',
            chr(48) => '0', chr(49) => '1', chr(50) => '2', chr(51) => '3',
            chr(52) => '4', chr(53) => '5', chr(54) => '6', chr(55) => '7',
            chr(56) => '8', chr(57) => '9', chr(58) => '/Z', chr(59) => '%F',
            chr(60) => '%G', chr(61) => '%H', chr(62) => '%I', chr(63) => '%J',
            chr(64) => '%V', chr(65) => 'A', chr(66) => 'B', chr(67) => 'C',
            chr(68) => 'D', chr(69) => 'E', chr(70) => 'F', chr(71) => 'G',
            chr(72) => 'H', chr(73) => 'I', chr(74) => 'J', chr(75) => 'K',
            chr(76) => 'L', chr(77) => 'M', chr(78) => 'N', chr(79) => 'O',
            chr(80) => 'P', chr(81) => 'Q', chr(82) => 'R', chr(83) => 'S',
            chr(84) => 'T', chr(85) => 'U', chr(86) => 'V', chr(87) => 'W',
            chr(88) => 'X', chr(89) => 'Y', chr(90) => 'Z', chr(91) => '%K',
            chr(92) => '%L', chr(93) => '%M', chr(94) => '%N', chr(95) => '%O',
            chr(96) => '%W', chr(97) => '+A', chr(98) => '+B', chr(99) => '+C',
            chr(100) => '+D', chr(101) => '+E', chr(102) => '+F', chr(103) => '+G',
            chr(104) => '+H', chr(105) => '+I', chr(106) => '+J', chr(107) => '+K',
            chr(108) => '+L', chr(109) => '+M', chr(110) => '+N', chr(111) => '+O',
            chr(112) => '+P', chr(113) => '+Q', chr(114) => '+R', chr(115) => '+S',
            chr(116) => '+T', chr(117) => '+U', chr(118) => '+V', chr(119) => '+W',
            chr(120) => '+X', chr(121) => '+Y', chr(122) => '+Z', chr(123) => '%P',
            chr(124) => '%Q', chr(125) => '%R', chr(126) => '%S', chr(127) => '%T');

        $code_ext = '';
        for ($i = 0; $i < strlen($code); $i++) {
            if (ord($code[$i]) > 127)
                $this->Error('Invalid character: ' . $code[$i]);
            $code_ext .= $encode[$code[$i]];
        }
        return $code_ext;
    }

    function draw_code39($code, $x, $y, $w, $h) {

        //Draw bars
        $xx=0;
        for ($i = 0; $i < strlen($code); $i++) {
            if ($code[$i] == '1') {
                $xx=$x + $i * $w;
                $this->Rect($x + $i * $w, $y, $w, $h, 'F');
            }
        }
        return $xx;
    }

    /* ----- */

    protected $isUtf8=true;
    var $fromTcpdf=true;
    var $phpGenPdfHead;
    var $phpGenPdf;
    var $phpGenPdfFooter;
    var $impresoDocuemntHead = false;
    var $impresoDocuemntFooter = false;
    //---------------------- i 2 en 5 inicio
    function i25($xpos, $ypos, $code, $basewidth=1, $height=10){

        $wide = $basewidth;
        $_xpos = $xpos;
        $narrow = $basewidth / 3 ;

        // wide/narrow codes for the digits
        $barChar['0'] = 'nnwwn';
        $barChar['1'] = 'wnnnw';
        $barChar['2'] = 'nwnnw';
        $barChar['3'] = 'wwnnn';
        $barChar['4'] = 'nnwnw';
        $barChar['5'] = 'wnwnn';
        $barChar['6'] = 'nwwnn';
        $barChar['7'] = 'nnnww';
        $barChar['8'] = 'wnnwn';
        $barChar['9'] = 'nwnwn';
        $barChar['A'] = 'nn';
        $barChar['Z'] = 'wn';

        // add leading zero if code-length is odd
        if(strlen($code) % 2 != 0){
            $code = $code.'0';
        }

        //$this->Text($xpos, $ypos + $height + 4, $code);
        $this->SetFillColor(0);
        $invalid=false;
        // add start and stop codes
        $code = 'AA'.strtolower($code).'ZA';

        for($i=0; $i<strlen($code); $i=$i+2){
            // choose next pair of digits
            $charBar = $code[$i];
            $charSpace = $code[$i+1];
            // check whether it is a valid digit
            if(!isset($barChar[$charBar])){
                $invalid=true;
                $charBar=0;
            }
            if(!isset($barChar[$charSpace])){
                $invalid=true;
                $charSpace=0;
            }
            // create a wide/narrow-sequence (first digit=bars, second digit=spaces)
            $seq = '';
            for($s=0; $s<strlen($barChar[$charBar]); $s++){
                $seq .= $barChar[$charBar][$s] . $barChar[$charSpace][$s];
            }
            for($bar=0; $bar<strlen($seq); $bar++){
                // set lineWidth depending on value
                if($seq[$bar] == 'n'){
                    $lineWidth = $narrow;
                }else{
                    $lineWidth = $wide;
                }
                // draw every second value, because the second digit of the pair is represented by the spaces
                if($bar % 2 == 0){
                    $this->Rect($xpos, $ypos, $lineWidth, $height, 'F');
                }
                $xpos += $lineWidth;
            }

        }
        if ( $invalid) {
            $this->Text($_xpos, $ypos , "Codigo Invalido");
        }
        return $xpos;
    }
    //---------------------- i 2 en 5 fin
    public function getH() {
        return $this->h;
    }
    public function setIsUtf8($isUtf8){
        $this->isUtf8=$isUtf8;
    }
    public function getIsUtf8(){
        return $this->isUtf8;
    }

    public function __construct($orientation = 'P', $unit = 'mm', $size = 'A4') {
        parent::__construct($orientation, $unit, $size);

        $existed = in_array("var2", stream_get_wrappers());
        if ($existed) {
            stream_wrapper_unregister("var2");
        }
        stream_wrapper_register('var2', 'Design\DesignBundle\Services\PdfExterno3\VariableStream');
    }

    public function setPageBreakTrigger($PageBreakTrigger) {
        $this->PageBreakTrigger = $PageBreakTrigger;
        $this->PageBreakTriggerO = $PageBreakTrigger;
    }

    public function getPageBreakTrigger() {
        return $this->PageBreakTrigger;
    }

    public function setDocumentHead() {
        $this->impresoDocuemntHead = true;
    }

    public function Header() {
        if ($this->impresoDocuemntHead == true) {
            if (is_object($this->phpGenPdfHead)) {
                if (is_object($this->phpGenPdf)) {
                    $this->phpGenPdfHead->write($this->phpGenPdf);
                }
            }
        }
    }

    public function Footer() {
        if (is_object($this->phpGenPdfFooter)) {
            if (is_object($this->phpGenPdf)) {
                $this->phpGenPdfFooter->write($this->phpGenPdf);
            }
        }
    }

    function setPhpGenPdf(PhpGenPdfHead $phpGenPdfHead, PhpGenPdf $phpGenPdf, PhpGenPdfFooter $foot) {
        $this->phpGenPdfHead = $phpGenPdfHead;
        $this->phpGenPdf = $phpGenPdf;
        $this->phpGenPdfFooter = $foot;
    }
    public function setBreakPage($break){
        $this->PageBreakTrigger = $break;
    }
    public function setPageIfSaltSection($obj, $top, $left){
        if  ($this->checkPageBreak($obj->PositionTop, $top)) {
            $aux1 = $this->PageBreakTrigger;
            $this->addPage();
            $aux2 = $this->PageBreakTrigger;
            $a1 = $this->phpGenPdfHead->getHeightHead();
            $a2 = $this->PageBreakTrigger;
            $a3 = $obj->PositionTop;
            $desde = $obj->PositionTop - ($aux1  - $top) + $this->phpGenPdfHead->getHeightHead();
            $page = $this->PageNo();
            $this->SetXY($obj->PositionLeft + $left, $desde);
        }else{
            $this->SetXY($obj->PositionLeft + $left, $obj->PositionTop + $top);

        }
        return true;

    }

    public function setPageIfSalt($obj, $top, $left,$Salta=false){
        if  ($this->checkPageBreak($obj->PositionTop, $top)) {
            $aux1 = $this->PageBreakTrigger;
            $this->addPage();
            $aux2 = $this->PageBreakTrigger;
            $a1 = $this->phpGenPdfHead->getHeightHead();
            $a2 = $this->PageBreakTrigger;
            $a3 = $obj->PositionTop;
            $desde = $obj->PositionTop - ($aux1  - $top) + $this->phpGenPdfHead->getHeightHead();
            $page = $this->PageNo();
            $this->SetXY($obj->PositionLeft + $left, $desde);
        }else{
            $this->SetXY($obj->PositionLeft + $left, $obj->PositionTop + $top);

        }
        return true;

    }
    public function getNewPageBreak($height,$listaItems){
        $pageBreak = (object)array();
        $pageBreak->isNew = false;
        $pageBreak->pageBreakOld = $this->PageBreakTrigger;
        $pageBreak->pageBreakNew = 0;
        if ($this->getY() + $height >= $this->PageBreakTrigger) {
            //------------------------------------------------------------------
            $yDesde = $this->getY();
            $CantItems = count($listaItems);
            $fin = false;
            //------------------------------------------------------------------
            while ($fin == false) {
                $fin = true;
                for ($i = 0; $i < $CantItems; $i++) {
                    // esto no entiendo porque esta asi
                    if (($yDesde + $listaItems[$i]->Top) <= $pageBreak->pageBreakOld) {
                        if (($yDesde + $listaItems[$i]->Top + $listaItems[$i]->Height) > ( $pageBreak->pageBreakOld + 0.01 ) ) {
                            $pageBreak->isNew = true;
                            $pageBreak->pageBreakNew = $yDesde + $listaItems[$i]->Top;
                            //$break = $yDesde + $itemA[$i]->Top;
                            $fin = false;
                            return $pageBreak;
                            break;
                        }
                    }
                }
            }

        }
        return $pageBreak;
    }

    function MemImage($data, $x = null, $y = null, $w = 0, $h = 0, $link = '',$expandir=true) {
        $v = 'img' . md5($data);
        VariableStream::$file[$v] = $data;
        $a = getimagesize('var2://' . $v);
        if (!$a)
            $this->Error('Invalid image data');
        $type = substr(strstr($a['mime'], '/'), 1);
        $this->Image('var2://' . $v, $x, $y, $w, $h, $type, $link,$expandir);
        unset(VariableStream::$file[$v]);
    }

    function GDImage($im, $x = null, $y = null, $w = 0, $h = 0, $link = '') {
        ob_start();
        imagepng($im);
        $data = ob_get_clean();
        $this->MemImage($data, $x, $y, $w, $h, $link);
    }
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    function WriteTable($tcolums) {
        // go through all colums
        $auxLeft = $this->GetX();
        for ($i = 0; $i < sizeof($tcolums); $i++) {
            $current_col = $tcolums[$i];
            $height = 0;

            // get max height of current col
            $this->setX($auxLeft);
            $nb = 0;
            for ($b = 0; $b < sizeof($current_col); $b++) {
                // set style
                $this->SetFont($current_col[$b]['font_name'], $current_col[$b]['font_style'], $current_col[$b]['font_size']);
                $color = explode(",", $current_col[$b]['fillcolor']);
                $this->SetFillColor($color[0], $color[1], $color[2]);
                $color = explode(",", $current_col[$b]['textcolor']);
                $this->SetTextColor($color[0], $color[1], $color[2]);
                $color = explode(",", $current_col[$b]['drawcolor']);
                $this->SetDrawColor($color[0], $color[1], $color[2]);
                $this->SetLineWidth($current_col[$b]['linewidth']);

                $nb = max($nb, $this->NbLines($current_col[$b]['width'], $current_col[$b]['text']));
                $height = $current_col[$b]['height'];
            }
            $h = $height * $nb;


            // Issue a page break first if needed
            $this->CheckPageBreakTable($h);
            $this->setX($auxLeft);
            // Draw the cells of the row
            for ($b = 0; $b < sizeof($current_col); $b++) {
                $w = $current_col[$b]['width'];
                $a = $current_col[$b]['align'];

                // Save the current position
                $x = $this->GetX();
                $y = $this->GetY();

                // set style
                $this->SetFont($current_col[$b]['font_name'], $current_col[$b]['font_style'], $current_col[$b]['font_size']);
                $color = explode(",", $current_col[$b]['fillcolor']);
                $this->SetFillColor($color[0], $color[1], $color[2]);
                $color = explode(",", $current_col[$b]['textcolor']);
                $this->SetTextColor($color[0], $color[1], $color[2]);
                $color = explode(",", $current_col[$b]['drawcolor']);
                $this->SetDrawColor($color[0], $color[1], $color[2]);
                $this->SetLineWidth($current_col[$b]['linewidth']);

                $color = explode(",", $current_col[$b]['fillcolor']);
                $this->SetDrawColor($color[0], $color[1], $color[2]);


                // Draw Cell Background
                $this->Rect($x, $y, $w, $h, 'FD');

                $color = explode(",", $current_col[$b]['drawcolor']);
                $this->SetDrawColor($color[0], $color[1], $color[2]);

                // Draw Cell Border
                if (substr_count($current_col[$b]['linearea'], "T") > 0) {
                    $this->Line($x, $y, $x + $w, $y);
                }

                if (substr_count($current_col[$b]['linearea'], "B") > 0) {
                    $this->Line($x, $y + $h, $x + $w, $y + $h);
                }

                if (substr_count($current_col[$b]['linearea'], "L") > 0) {
                    $this->Line($x, $y, $x, $y + $h);
                }

                if (substr_count($current_col[$b]['linearea'], "R") > 0) {
                    $this->Line($x + $w, $y, $x + $w, $y + $h);
                }


                // Print the text
                $this->MultiCell($w, $current_col[$b]['height'], $current_col[$b]['text'], 0, $a, 0);

                // Put the position to the right of the cell
                $this->SetXY($x + $w, $y);
            }

            // Go to the next line
            $this->Ln($h);
        }
    }

    // If the height h would cause an overflow, add a new page immediately
    function CheckPageBreakTable($h) {
        if ($this->GetY() + $h > $this->PageBreakTrigger)
            $this->AddPage($this->CurOrientation);
    }

    // Computes the number of lines a MultiCell of width w will take
    function NbLines($w, $txt) {
        $cw = &$this->CurrentFont['cw'];
        if ($w == 0)
            $w = $this->w - $this->rMargin - $this->x;
        $wmax = ($w - 2 * $this->cMargin) * 1000 / $this->FontSize;
        $s = str_replace("\r", '', $txt);
        $nb = strlen($s);
        if ($nb > 0 and $s[$nb - 1] == "\n")
            $nb--;
        $sep = -1;
        $i = 0;
        $j = 0;
        $l = 0;
        $nl = 1;
        while ($i < $nb) {
            $c = $s[$i];
            if ($c == "\n") {
                $i++;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
                continue;
            }
            if ($c == ' ')
                $sep = $i;
            $l+=$cw[$c];
            if ($l > $wmax) {
                if ($sep == -1) {
                    if ($i == $j)
                        $i++;
                }
                else
                    $i = $sep + 1;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
            }
            else
                $i++;
        }
        return $nl;
    }

    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    //--------------------------------------------------------------------------
    //********* inicio cache
/*
    protected $f;

    function Open($file='doc.pdf')
    {
        if(FPDF_VERSION<'1.8')
            $this->Error('Version 1.8 or above is required by this extension');
        $this->f=tmpfile();
        //$this->f=fopen($file,'wb');
        if(!$this->f)
            $this->Error('Unable to create output file: '.$file);
        $this->_putheader();
    }

    function Image($file, $x=null, $y=null, $w=0, $h=0, $type='', $link='')
    {
        if(!isset($this->images[$file]))
        {
            //Retrieve only meta-information
            $a=getimagesize($file);
            if($a===false)
                $this->Error('Missing or incorrect image file: '.$file);
            $this->images[$file]=array('w'=>$a[0],'h'=>$a[1],'type'=>$a[2],'i'=>count($this->images)+1);
        }
        parent::Image($file,$x,$y,$w,$h,$type,$link);
    }

    function Output($dest='', $name='', $isUTF8=false)
    {
        if($this->state<3)
            $this->Close();
    }

    function _endpage()
    {
        parent::_endpage();
        //Write page to file
        $this->_putstreamobject($this->pages[$this->page]);
        unset($this->pages[$this->page]);
    }

    function _getoffset()
    {
        return ftell($this->f);
    }

    function _put($s)
    {
        fwrite($this->f,$s."\n",strlen($s)+1);
    }

    function _putimages()
    {
        foreach(array_keys($this->images) as $file)
        {
            $type=$this->images[$file]['type'];
            if($type==1)
                $info=$this->_parsegif($file);
            elseif($type==2)
                $info=$this->_parsejpg($file);
            elseif($type==3)
                $info=$this->_parsepng($file);
            else
                $this->Error('Unsupported image type: '.$file);
            $this->_putimage($info);
            $this->images[$file]['n']=$info['n'];
            unset($info);
        }
    }

    function _putpages()
    {
        $nb=$this->page;
        for($n=1;$n<=$nb;$n++)
            $this->PageInfo[$n]['n']=$this->n+$n;
        if($this->DefOrientation=='P')
        {
            $wPt=$this->DefPageSize[0]*$this->k;
            $hPt=$this->DefPageSize[1]*$this->k;
        }
        else
        {
            $wPt=$this->DefPageSize[1]*$this->k;
            $hPt=$this->DefPageSize[0]*$this->k;
        }
        //Page objects
        for($n=1;$n<=$nb;$n++)
        {
            $this->_newobj();
            $this->_put('<</Type /Page');
            $this->_put('/Parent 1 0 R');
            if(isset($this->PageInfo[$n]['size']))
                $this->_put(sprintf('/MediaBox [0 0 %.2F %.2F]',$this->PageInfo[$n]['size'][0],$this->PageInfo[$n]['size'][1]));
            if(isset($this->PageInfo[$n]['rotation']))
                $this->_put('/Rotate '.$this->PageInfo[$n]['rotation']);
            $this->_put('/Resources 2 0 R');
            if(isset($this->PageLinks[$n]))
            {
                //Links
                $annots='/Annots [';
                foreach($this->PageLinks[$n] as $pl)
                {
                    $rect=sprintf('%.2F %.2F %.2F %.2F',$pl[0],$pl[1],$pl[0]+$pl[2],$pl[1]-$pl[3]);
                    $annots.='<</Type /Annot /Subtype /Link /Rect ['.$rect.'] /Border [0 0 0] ';
                    if(is_string($pl[4]))
                        $annots.='/A <</S /URI /URI '.$this->_textstring($pl[4]).'>>>>';
                    else
                    {
                        $l=$this->links[$pl[4]];
                        if(isset($this->PageInfo[$l[0]]['size']))
                            $h=$this->PageInfo[$l[0]]['size'][1];
                        else
                            $h=$hPt;
                        $annots.=sprintf('/Dest [%d 0 R /XYZ 0 %.2F null]>>',$this->PageInfo[$l[0]]['n'],$h-$l[1]*$this->k);
                    }
                }
                $this->_put($annots.']');
            }
            if($this->WithAlpha)
                $this->_put('/Group <</Type /Group /S /Transparency /CS /DeviceRGB>>');
            $this->_put('/Contents '.(2+$n).' 0 R>>');
            $this->_put('endobj');
        }
        //Pages root
        $this->offsets[1]=$this->_getoffset();
        $this->_put('1 0 obj');
        $this->_put('<</Type /Pages');
        $kids='/Kids [';
        for($n=1;$n<=$nb;$n++)
            $kids.=(2+$nb+$n).' 0 R ';
        $this->_put($kids.']');
        $this->_put('/Count '.$nb);
        $this->_put(sprintf('/MediaBox [0 0 %.2F %.2F]',$wPt,$hPt));
        $this->_put('>>');
        $this->_put('endobj');
    }

    function _putheader()
    {
        if($this->_getoffset()==0)
            parent::_putheader();
    }

    function _enddoc()
    {
        parent::_enddoc();
        fclose($this->f);
    }
    */
}
?>
