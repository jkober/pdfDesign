<?php

namespace Design\DesignBundle\Services\PdfExterno3;

use Design\DesignBundle\Services\PdfExterno3\PdfGenRotate;

//------------------------------------------------------------------------------
class PhpGenPdfFPDF extends PdfGenRotate {

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

    public function setPageBreakTrigger($PageBreakTrigger) {
        return $this->PageBreakTrigger = $PageBreakTrigger;
    }

    public function getPageBreakTrigger() {
        return $this->PageBreakTrigger;
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

    public function KoberAddPage($orientation = '', $size = '') {
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
        $this->_beginpage($orientation, $size);
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

    function Kober_beginpage($orientation, $size) {
        $this->page++;
        if (!isset($this->pages[$this->page])) // solves the problem of overwriting a page if it already exists
            $this->pages[$this->page] = '';

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
}

?>